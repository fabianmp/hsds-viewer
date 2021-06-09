import logging
import os
import secrets
from functools import reduce
from itertools import product
from math import ceil
from typing import Any, Dict, List, Union
from urllib.parse import urlparse

import numpy as np
import requests
from flask import Flask, abort, json, request, send_from_directory, session
from flask_caching import Cache
from h5pyd import Config, Dataset, File, Folder, Group, getServerInfo

from _version import __version__
from authentication import configure_authentication, require_role

logging.basicConfig(
    format=os.environ.get("LOG_FORMAT", "%(asctime)s\t%(levelname)s\t%(message)s"),
    level=os.environ.get("LOG_LEVEL", "WARN").upper(),
)

app = Flask(__name__, static_url_path="/")
app.secret_key = os.environ.get("SECRET_KEY")
if app.secret_key is None:
    app.secret_key = secrets.token_urlsafe()
configure_authentication(app)

cache = Cache(app, config={"CACHE_TYPE": "SimpleCache"})

credentials_file = os.environ.get("HSDS_CREDENTIALS_FILE", "credentials.json")
if os.path.isfile(credentials_file):
    with open(credentials_file, "r") as f:
        credentials = json.load(f)
else:
    credentials = {}


def get_username() -> str:
    if "username" in session:
        return session.setdefault("hsds_user", session["username"])
    else:
        return session.setdefault("hsds_user", os.environ.get("HSDS_DEFAULT_USER", ""))


def get_credentials() -> Dict[str, str]:
    username = get_username()

    if "access_token" in session and username == session.get("username"):
        return {"username": username, "api_key": session["access_token"]}
    else:
        return {"username": username, "password": credentials.get(username, "")}


@app.route("/")
def index():
    return send_from_directory("static", "index.html")


@app.route("/healthz")
def healthz():
    return "OK"


def convert_timestamp(timestamp: float) -> int:
    return int(timestamp * 1000)


@app.route("/api/info")
def info() -> Dict[str, Any]:
    try:
        return {"version": __version__, **getServerInfo(**get_credentials())}
    except Exception as e:
        print(e)
        config = Config()
        return {
            "version": __version__,
            "endpoint": config["hs_endpoint"],
            "state": "ERROR",
            "node_count": 0,
            "hsds_version": "<unknown>",
            "username": session["hsds_user"],
        }


@cache.memoize(60)
def get_folder_content_from_hsds(path, username):
    result = {
        "subfolders": [],
        "domains": [],
    }
    with Folder(path, mode="r", **get_credentials(), batch_size=100) as folder:
        for name in folder:
            item = folder[name]
            if item["class"] == "folder":
                result["subfolders"].append(
                    {
                        "path": item["name"],
                        "name": name,
                        "type": item["class"],
                        "owner": item["owner"],
                        "created": convert_timestamp(item["created"]),
                        "modified": convert_timestamp(item["lastModified"]),
                    }
                )
            elif item["class"] == "domain":
                result["domains"].append(
                    {
                        "path": item["name"],
                        "name": name,
                        "type": item["class"],
                        "owner": item["owner"],
                        "created": convert_timestamp(item["created"]),
                        "modified": convert_timestamp(item["lastModified"]),
                        "total_size": item.get("total_size", 0),
                    }
                )
        folder.close()
    return result


@app.route("/api/folder/", defaults={"path": ""})
@app.route("/api/folder/<path:path>")
def get_folder(path: str) -> List[Dict[str, Any]]:
    path = f"/{path}"
    if not path.endswith("/"):
        path = f"{path}/"

    result = get_folder_content_from_hsds(path, get_username())
    return json.dumps(result)


@app.route("/api/folder/<path:path>/acl")
def get_folder_acl(path: str) -> List[Dict[str, Any]]:
    path = f"/{path}"
    if not path.endswith("/"):
        path = f"{path}/"

    with Folder(path, mode="r", **get_credentials()) as folder:
        if path != "/":
            try:
                acls = folder.getACLs()
            except:
                acls = []
        folder.close()
    return json.dumps(acls)


def calculate_chunks(shape: tuple, chunks: tuple):
    if not shape or not chunks:
        return 0
    chunks_per_dimension = [s / c for s, c in zip(shape, chunks)]
    return ceil(reduce(lambda x, y: x * y, chunks_per_dimension))


def get_attributes(group: Union[Group, Dataset]):
    attrs = []
    for key, value in group.attrs.items():
        attr = {
            "name": key,
        }
        if isinstance(value, str):
            attr["value"] = value
        elif isinstance(value, (np.ndarray, np.integer, np.floating)):
            attr["value"] = str(value)
        else:
            attr["value"] = f"<unknown> {str(type(value))}"
        attrs.append(attr)
    return attrs


def get_group_info(group: Union[Group, Dataset]) -> Dict[str, Any]:
    info = {
        "name": group.name,
        "type": "Unknown",
        "attributes": get_attributes(group),
    }
    if isinstance(group, Group):
        info["type"] = "Group"
    elif isinstance(group, Dataset):
        info["type"] = "Dataset"
        info["size"] = int(group.size * group.dtype.itemsize)
        info["shape"] = group.shape
        info["chunks"] = calculate_chunks(group.shape, group.chunks)
        info["chunk_shape"] = group.chunks
        info["datatype_name"] = group.dtype.name
        info["datatype_kind"] = group.dtype.kind
    return info


@cache.memoize(60)
def get_file_content_from_hsds(path, username):
    try:
        with File(f"/{path}", "r", **get_credentials()) as file:
            groups = [get_group_info(file)]
            info = {
                "domain": os.path.dirname(file.filename),
                "filename": os.path.basename(file.filename),
                "md5_sum": file.md5_sum,
                "created": convert_timestamp(file.created),
                "modified": convert_timestamp(file.modified),
                "owner": file.owner,
                "total_size": file.total_size,
                "num_chunks": file.num_chunks,
                "num_groups": file.num_groups,
                "groups": groups,
            }
            file.visititems(lambda name, item: groups.append(get_group_info(item)))
    except IOError as error:
        if error.errno in (404, 410):  # Not Found
            abort(404)
        elif error.errno in (401, 403):  # Unauthorized
            info = {
                "unauthorized": True,
                "domain": os.path.dirname(f"/{path}"),
                "filename": os.path.basename(f"/{path}"),
                "md5_sum": "<unauthorized>",
                "created": 0,
                "modified": 0,
                "owner": "<unauthorized>",
                "total_size": 0,
                "num_chunks": 0,
                "num_groups": 0,
                "groups": [],
            }
        else:
            raise
    return info


@app.route("/api/domain/<path:path>")
def get_domain(path: str) -> Dict[str, Any]:
    info = get_file_content_from_hsds(path, get_username())
    return json.dumps(info)


@app.route("/api/domain/<path:path>/acl")
def get_domain_acl(path: str) -> Dict[str, Any]:
    try:
        with File(f"/{path}", "r", **get_credentials()) as file:
            acls = file.getACLs()
    except IOError as error:
        if error.errno in (404, 410):  # Not Found
            abort(404)
        elif error.errno in (401, 403):  # Unauthorized
            acls = []
        else:
            raise
    return json.dumps(acls)


@app.route("/api/current_user", methods=["GET", "POST"])
def current_user():
    if request.method == "POST":
        session["hsds_user"] = request.get_json()["name"]

    if "username" in session:
        session.setdefault("hsds_user", session["username"])
    else:
        session.setdefault("hsds_user", os.environ.get("HSDS_DEFAULT_USER", "admin"))

    return json.dumps({"name": session["hsds_user"], "roles": session.get("roles", [])})


@app.route("/api/users")
def get_users():
    users = list(credentials.keys())
    if "username" in session:
        users.insert(0, session["username"])
    return json.dumps(users)


@app.route("/api/features")
def get_features():
    features = []
    if "FEATURE_NODE_INFO_ENABLED" in os.environ:
        features.append("node_info")
    return json.dumps(features)


if "FEATURE_NODE_INFO_ENABLED" in os.environ:

    @app.route("/api/nodes")
    @require_role("admin")
    def get_nodes():
        endpoint = Config()["hs_endpoint"]
        about = requests.get(f"{endpoint}/about").json()
        nodes = []
        for url, port in product(about["dn_urls"], (5101, 6101)):
            parsed = urlparse(url)
            info = requests.get(f"{parsed.scheme}://{parsed.hostname}:{port}/info").json()
            nodes.append(info)
        return json.dumps(nodes)


if os.environ.get("ENABLE_CORS", False):
    from flask_cors import CORS

    CORS(app)


if os.environ.get("USE_PROXY_FIX", False):
    from werkzeug.middleware.proxy_fix import ProxyFix

    app = ProxyFix(app, x_for=1, x_host=1)


if __name__ == "__main__":
    app.run(
        host="localhost", port=5000, debug=True, use_reloader=True, use_debugger=True
    )
