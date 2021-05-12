import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TreeItem from "@material-ui/lab/TreeItem";
import React from "react";
import useSWR from 'swr';
import { Folder as ApiFolder, NodeInfo } from '../Api';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    treeItem: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  }),
);

interface Props {
  node: NodeInfo,
  selectedNode: string
  expandedNodes: string[]
  expandNode: (nodeId: string) => void
}

export default function TreeFolder({ node, selectedNode, expandedNodes, expandNode }: Props) {
  const classes = useStyles();
  const isSelected = selectedNode === node.path;
  const isExpanded = expandedNodes.includes(node.path);
  const { data: folder = null } = useSWR<ApiFolder>((isSelected || isExpanded) ? `/api/folder${node.path}` : null)

  if (isSelected && folder && folder.subfolders.length > 0) {
    expandNode(node.path);
  }

  return (
    <TreeItem nodeId={node.path} label={node.name} className={classes.treeItem}>
      {folder?.subfolders.map((folder: NodeInfo) => <TreeFolder key={folder.path} node={folder}
        selectedNode={selectedNode} expandedNodes={expandedNodes} expandNode={expandNode} />)}
    </TreeItem>
  );
}
