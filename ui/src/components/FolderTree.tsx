
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import TreeView from "@material-ui/lab/TreeView";
import React, { ChangeEvent } from "react";
import { Folder, NodeInfo } from '../Api';
import TreeFolder from "./TreeFolder";

interface Props {
  folder: Folder,
  handleNodeSelect: (path: string) => void
}

export default function FolderTree({ folder, handleNodeSelect }: Props) {
  return (
    <TreeView
      onNodeSelect={(_: ChangeEvent<{}>, path: string) => handleNodeSelect(path)}
      defaultCollapseIcon={<FolderOpenIcon />}
      defaultExpandIcon={<FolderIcon />}
      defaultEndIcon={<FolderIcon />}>
      {folder?.subfolders.map((folder: NodeInfo) => <TreeFolder key={folder.path} node={folder} />)}
    </TreeView>
  );
}
