import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import prettyBytes from "pretty-bytes";
import React from "react";
import { Folder, NodeInfo } from '../Api';

interface Props {
  folder: Folder
  selected: string
  handleSelect: (path: string) => void
}

export default function FolderContent({ folder, handleSelect, selected }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Owner</b></TableCell>
            <TableCell><b>Size</b></TableCell>
            <TableCell><b>Created</b></TableCell>
            <TableCell><b>Modified</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {folder.domains.map((domain: NodeInfo) =>
            <TableRow key={domain.name} hover onClick={() => handleSelect(domain.path)} role="checkbox" selected={domain.path === selected}>
              <TableCell component="th" scope="row">{domain.name}</TableCell>
              <TableCell>{domain.owner}</TableCell>
              <TableCell>{prettyBytes(domain.total_size)}</TableCell>
              <TableCell>{new Date(domain.created).toLocaleString()}</TableCell>
              <TableCell>{new Date(domain.modified).toLocaleString()}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
