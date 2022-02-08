import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import { HsdsNodeInfo } from "../Api";

export default function NodeInfo() {
  const { data: nodes = [] } = useSWR<HsdsNodeInfo[]>("/api/nodes");

  return (
    <Container sx={{ "& > * + *": { marginTop: 2 } }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Nodes
          </Typography>
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
              {nodes.map((n) => (
                <TableRow key={n.node.id}>
                  <TableCell>{n.node.id}</TableCell>
                  <TableCell>{new Date(n.node.start_time! * 1000).toLocaleString()}</TableCell>
                  <TableCell>{n.node.state}</TableCell>
                  <TableCell>{n.req_count.num_tasks}</TableCell>
                  <TableCell>{n.req_count.GET}</TableCell>
                  <TableCell>{n.req_count.PUT}</TableCell>
                  <TableCell>{n.req_count.POST}</TableCell>
                  <TableCell>{n.req_count.DELETE}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}
