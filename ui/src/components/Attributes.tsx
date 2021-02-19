import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { Attribute } from "../Api";

interface Props {
  attributes: Attribute[]
}

export default function Attributes({ attributes }: Props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Value</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attributes.map((attribute) =>
            <TableRow key={attribute.name}>
              <TableCell component="th" scope="row">{attribute.name}</TableCell>
              <TableCell>{attribute.value}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
