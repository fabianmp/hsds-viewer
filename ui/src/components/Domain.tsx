import Grid from "@material-ui/core/Grid";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import TreeItem from "@material-ui/lab/TreeItem";
import prettyBytes from 'pretty-bytes';
import React from "react";
import { Node } from '../Api';

interface Props {
  node: Node
}

export default function Domain({ node }: Props) {
  return (
    <TreeItem key={node.path} nodeId={node.path} icon={<LibraryBooksIcon />} label={
      <Grid container spacing={3}>
        <Grid item xs={2}>{node.name}</Grid>
        <Grid item xs={2}><b>Size:</b> {prettyBytes(node.total_size)}</Grid>
        <Grid item xs={2}><b>Owner:</b> {node.owner}</Grid>
        <Grid item xs={3}><b>Created:</b> {node.created}</Grid>
        <Grid item xs={3}><b>Modified:</b> {node.modified}</Grid>
      </Grid>}>
    </TreeItem>
  );
}
