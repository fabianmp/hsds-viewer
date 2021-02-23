
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { green, red } from '@material-ui/core/colors';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import React, { ReactElement } from "react";
import { ACL } from '../Api';
import AlignIcon from './AlignIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  variant: "small" | "wide"
}

export function AccessControlTable({ acls, variant }: Props) {
  const classes = useStyles();
  const allowed = <CheckIcon fontSize="small" className={classes.allowed} />;
  const denied = <ClearIcon fontSize="small" className={classes.denied} />;

  const wrapTitle = (icon: ReactElement, label: string) => {
    return variant === "wide"
      ? <AlignIcon>{icon}<b>{label}</b></AlignIcon>
      : <Tooltip title={label}>{icon}</Tooltip>
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" padding="none">{wrapTitle(<PersonIcon fontSize="small" />, "User")}</TableCell>
            <TableCell align="center" padding="none">{wrapTitle(<AddIcon fontSize="small" />, "Create")}</TableCell>
            <TableCell align="center" padding="none">{wrapTitle(<SearchIcon fontSize="small" />, "Read")}</TableCell>
            <TableCell align="center" padding="none">{wrapTitle(<EditIcon fontSize="small" />, "Update")}</TableCell>
            <TableCell align="center" padding="none">{wrapTitle(<DeleteIcon fontSize="small" />, "Delete")}</TableCell>
            <TableCell align="center" padding="none">{wrapTitle(<GroupIcon fontSize="small" />, "Read ACL")}</TableCell>
            <TableCell align="center" padding="none">{wrapTitle(<GroupAddIcon fontSize="small" />, "Update ACL")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {acls.map((acl: ACL) => <TableRow key={acl.userName} hover>
            <TableCell component="th" scope="row" align="center" padding="none">{acl.userName}</TableCell>
            <TableCell align="center" padding="none">{acl.create ? allowed : denied}</TableCell>
            <TableCell align="center" padding="none">{acl.read ? allowed : denied}</TableCell>
            <TableCell align="center" padding="none">{acl.update ? allowed : denied}</TableCell>
            <TableCell align="center" padding="none">{acl.delete ? allowed : denied}</TableCell>
            <TableCell align="center" padding="none">{acl.readACL ? allowed : denied}</TableCell>
            <TableCell align="center" padding="none">{acl.updateACL ? allowed : denied}</TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function AccessControl({ acls }: Props) {
  const classes = useStyles();

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} classes={{ content: classes.summary, expanded: classes.expanded }}>
        <Typography variant="subtitle2"><AlignIcon><LockIcon />Access Control</AlignIcon></Typography>
      </AccordionSummary>
      <AccordionDetails>
        <AccessControlTable variant="wide" acls={acls} />
      </AccordionDetails>
    </Accordion>
  );
}
