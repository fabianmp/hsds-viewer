import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { Attribute } from "../Api";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    value: {
      whiteSpace: 'pre-wrap',
    },
  }),
);

interface Props {
  attributes: Attribute[]
}

export default function Attributes({ attributes }: Props) {
  const classes = useStyles();

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
              <TableCell className={classes.value}>{attribute.value}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
