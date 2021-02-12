import os
from datetime import datetime
from typing import Any, Dict, List, Union

from flask import Flask, abort, json, send_from_directory
from h5pyd import Dataset, File, Folder, Group, getServerInfo
from werkzeug.middleware.proxy_fix import ProxyFix

from authentication import configure_authentication

app = Flask(__name__, static_url_path="/")
configure_authentication(app)


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
    return getServerInfo()


@app.route("/api/folder/", defaults={"path": ""})
@app.route("/api/folder/<path:path>")
def get_folder(path: str) -> List[Dict[str, Any]]:
    path = f"/{path}"
    if not path.endswith("/"):
        path = f"{path}/"

    result = {
        "acls": [],
        "subfolders": [],
        "domains": [],
    }
    with Folder(path, mode="r") as folder:
        if path != "/":
            result["acls"] = folder.getACLs()
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
    return json.dumps(result)


def get_group_info(group: Union[Group, Dataset]) -> Dict[str, Any]:
    info = {"name": group.name, "type": "Unknown"}
    if isinstance(group, Group):
        info["type"] = "Group"
    elif isinstance(group, Dataset):
        info["type"] = "Dataset"
        info["size"] = group.allocated_size
    return info


@app.route("/api/domain/<path:path>")
def get_domain(path: str) -> Dict[str, Any]:
    try:
        with File(f"/{path}", "r") as file:
            groups = []
            info = {
                "acls": file.getACLs(),
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
        else:
            raise
    return json.dumps(info)


if os.environ.get("USE_PROXY_FIX", False):
    app = ProxyFix(app, x_for=1, x_host=1)


if __name__ == "__main__":
    app.run(
        host="localhost", port=5000, debug=True, use_reloader=True, use_debugger=True
    )
