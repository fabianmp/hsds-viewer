import TreeItem from "@material-ui/lab/TreeItem";
import React from "react";
import useSWR from 'swr';
import { Folder as ApiFolder, NodeInfo } from '../Api';

interface Props {
  node: NodeInfo,
}

export default function TreeFolder({ node }: Props) {
  const { data: folder = null } = useSWR<ApiFolder>(`/api/folder${node.path}`)

  return (
    <TreeItem nodeId={node.path} label={node.name}>
      {folder?.subfolders.map((folder: NodeInfo) => <TreeFolder key={folder.path} node={folder} />)}
    </TreeItem>
  );
}
