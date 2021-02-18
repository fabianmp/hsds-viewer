
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { green, red } from '@material-ui/core/colors';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LockIcon from '@material-ui/icons/Lock';
import React from "react";
import { ACL } from '../Api';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    summary: {
      margin: 0,
      '&$expanded': {
        margin: 0
      }
    },
    expanded: {},
    allowed: {
      color: green[500]
    },
    denied: {
      color: red[500]
    },
  }),
);

interface Props {
  acls: ACL[]
}

export default function AccessControl({ acls }: Props) {
  const classes = useStyles();
  const allowed = <CheckIcon fontSize="small" className={classes.allowed} />;
  const denied = <ClearIcon fontSize="small" className={classes.denied} />;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} classes={{content: classes.summary, expanded: classes.expanded}}>
        <Typography variant="subtitle2" className={classes.title}><LockIcon />Access Control</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>User</b></TableCell>
                <TableCell><b>Create</b></TableCell>
                <TableCell><b>Read</b></TableCell>
                <TableCell><b>Update</b></TableCell>
                <TableCell><b>Delete</b></TableCell>
                <TableCell><b>Read ACL</b></TableCell>
                <TableCell><b>Update ACL</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {acls.map((acl: ACL) => <TableRow key={acl.userName} hover>
                <TableCell component="th" scope="row">{acl.userName}</TableCell>
                <TableCell>{acl.create ? allowed : denied}</TableCell>
                <TableCell>{acl.read ? allowed : denied}</TableCell>
                <TableCell>{acl.update ? allowed : denied}</TableCell>
                <TableCell>{acl.delete ? allowed : denied}</TableCell>
                <TableCell>{acl.readACL ? allowed : denied}</TableCell>
                <TableCell>{acl.updateACL ? allowed : denied}</TableCell>
              </TableRow>)}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}
