import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from '@material-ui/core/Container';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import React from "react";
import useSWR from "swr";
import { HsdsNodeInfo } from "../Api";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }),
);

export default function NodeInfo() {
  const classes = useStyles();
  const { data: nodes = [] } = useSWR<HsdsNodeInfo[]>('/api/nodes');

  return (<Container className={classes.root}>
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">Nodes</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Started</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Tasks</TableCell>
              <TableCell>GET</TableCell>
              <TableCell>PUT</TableCell>
              <TableCell>POST</TableCell>
              <TableCell>DELETE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nodes.map(n => <TableRow>
              <TableCell>{n.node.id}</TableCell>
              <TableCell>{new Date(n.node.start_time! * 1000).toLocaleString()}</TableCell>
              <TableCell>{n.node.state}</TableCell>
              <TableCell>{n.req_count.num_tasks}</TableCell>
              <TableCell>{n.req_count.GET}</TableCell>
              <TableCell>{n.req_count.PUT}</TableCell>
              <TableCell>{n.req_count.POST}</TableCell>
              <TableCell>{n.req_count.DELETE}</TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </Container>);
}
