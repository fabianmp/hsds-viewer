import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TreeItem from "@material-ui/lab/TreeItem";
import React from "react";
import useSWR from 'swr';
import { Folder as ApiFolder, NodeInfo } from '../Api';
import { useSelectedFolderPath } from '../Hooks';

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
  expandedNodes: string[]
  expandNode: (nodeId: string) => void
}

export default function TreeFolder({ node, expandedNodes, expandNode }: Props) {
  const classes = useStyles();
  const selectedNode = useSelectedFolderPath();
  const isSelected = selectedNode === node.path;
  const isExpanded = expandedNodes.includes(node.path);
  const { data: folder = null } = useSWR<ApiFolder>((isSelected || isExpanded) ? `/api/folder${node.path}` : null)

  if (isSelected && folder && folder.subfolders.length > 0) {
    expandNode(node.path);
  }

  return (
    <TreeItem nodeId={node.path} label={node.name} className={classes.treeItem}>
      {folder?.subfolders.map((folder: NodeInfo) => <TreeFolder key={folder.path} node={folder}
        expandedNodes={expandedNodes} expandNode={expandNode} />)}
    </TreeItem>
  );
}
