import os
from datetime import datetime
from typing import Any, Dict, List, Union

from flask import Flask, abort, json
from h5pyd import Dataset, File, Folder, Group, getServerInfo

app = Flask(__name__)


def convert_timestamp(timestamp: float) -> str:
    return datetime.fromtimestamp(int(timestamp)).isoformat()


@app.route("/api/info")
def info() -> Dict[str, Any]:
    return getServerInfo()


@app.route("/api/list-folder/", defaults={"path": ""})
@app.route("/api/list-folder/<path:path>")
def list_folder(path: str) -> List[Dict[str, Any]]:
    path = f"/{path}"
    if not path.endswith("/"):
        path = f"{path}/"

    items = []
    with Folder(path, mode="r") as folder:
        for name in folder:
            item = folder[name]
            items.append({
                "path": item["name"],
                "name": name,
                "type": item["class"],
                "owner": item["owner"],
                "created": convert_timestamp(item["created"]),
                "modified": convert_timestamp(item["lastModified"]),
                "total_size": item.get("total_size", 0),
            })
        folder.close()
    return json.dumps(items)


def get_group_info(group: Union[Group, Dataset]) -> Dict[str, Any]:
    info = {
        "name": group.name,
        "type": "Unknown"
    }
    if isinstance(group, Group):
        info["type"] = "Group"
    elif isinstance(group, Dataset):
        info["type"] = "Dataset"
        info["size"] = group.allocated_size
    return info


@app.route("/api/file-info/<path:path>")
def get_file_info(path: str) -> Dict[str, Any]:
    try:
        with File(f"/{path}", "r") as file:
            groups = []
            info = {
                "domain": os.path.dirname(file.filename),
                "filename": os.path.basename(file.filename),
                "md5_sum": file.md5_sum,
                "created": datetime.fromtimestamp(int(file.created)).isoformat(),
                "modified": datetime.fromtimestamp(int(file.modified)).isoformat(),
                "owner": file.owner,
                "total_size": file.total_size,
                "num_chunks": file.num_chunks,
                "num_groups": file.num_groups,
                "groups": groups
            }
            file.visititems(
                lambda name, item: groups.append(get_group_info(item)))
    except IOError as error:
        if error.errno in (404, 410):   # Not Found
            abort(404)
        else:
            raise
    return json.dumps(info)


if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True,
            use_reloader=True, use_debugger=True)
