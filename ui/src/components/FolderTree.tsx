import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import RefreshIcon from "@mui/icons-material/Refresh";
import TreeView from "@mui/lab/TreeView";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mutate } from "swr";
import { Folder, NodeInfo } from "../Api";
import { useSelectedFolderPath } from "../Hooks";
import TreeFolder from "./TreeFolder";

const sx = {
  drawerHeading: {
    display: "flex",
    alignItems: "center",
  },
  drawerHeadingTitle: {
    paddingLeft: 2,
    flexGrow: 1,
  },
} as const;

interface Props {
  folder: Folder;
}

export default function FolderTree({ folder }: Props) {
  const navigate = useNavigate();
  const selectedFolderPath = useSelectedFolderPath();

  const [expanded, setExpanded] = useState<string[]>([]);

  const expandNode = (nodeId: string) => {
    if (!expanded.includes(nodeId)) {
      setExpanded(expanded.concat([nodeId]));
    }
  };

  if (selectedFolderPath !== "/" && expanded.length === 0) {
    let expandNodes: string[] = [];
    const folders = selectedFolderPath.split("/");
    for (let i = 2; i < folders.length; ++i) {
      expandNodes.splice(expandNodes.length, 0, `${folders.slice(0, i).join("/")}/`);
    }
    setExpanded(expandNodes);
  }

  const handleSelect = (event: ChangeEvent<{}>, nodeId: string) => {
    navigate(nodeId);
  };

  const reloadFolders = () => {
    mutate(`/api/folder/`);
    expanded.forEach((x) => {
      mutate(`/api/folder${x}`);
      mutate(`/api/folder${x}acl`);
    });
  };

  return (
    <>
      <Box sx={sx.drawerHeading}>
        <Typography variant="h6" sx={sx.drawerHeadingTitle}>
          Folders
        </Typography>
        <IconButton onClick={reloadFolders}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>
      <TreeView
        expanded={expanded}
        selected={selectedFolderPath}
        onNodeSelect={handleSelect}
        defaultCollapseIcon={<FolderOpenIcon />}
        defaultExpandIcon={<FolderIcon />}
        defaultEndIcon={<FolderIcon />}
      >
        {folder?.subfolders.map((folder: NodeInfo) => (
          <TreeFolder key={folder.path} node={folder} expandedNodes={expanded} expandNode={expandNode} />
        ))}
      </TreeView>
    </>
  );
}
