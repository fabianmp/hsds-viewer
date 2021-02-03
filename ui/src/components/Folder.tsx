import Grid from "@material-ui/core/Grid";
import FolderIcon from '@material-ui/icons/Folder';
import TreeItem from "@material-ui/lab/TreeItem";
import React from "react";
import useSWR from 'swr';
import { Node } from '../Api';
import Domain from "./Domain";

interface Props {
  node: Node,
}

export default function Folder({ node }: Props) {
  const { data: domains = [] } = useSWR<Node[]>(`/api/list-folder${node.path}`)

  return (
    <TreeItem nodeId={node.path} icon={<FolderIcon />} label={
      <Grid container spacing={3}>
        <Grid item xs={4}>{node.name}</Grid>
        <Grid item xs={2}><b>Owner:</b> {node.owner}</Grid>
        <Grid item xs={3}><b>Created:</b> {node.created}</Grid>
        <Grid item xs={3}><b>Modified:</b> {node.modified}</Grid>
      </Grid>}>
      {domains.map((domain: Node) => <Domain key={domain.path} node={domain} />)}
    </TreeItem>
  );
}
