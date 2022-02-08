import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupIcon from "@mui/icons-material/Group";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { green, red } from "@mui/material/colors";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { ReactElement } from "react";
import { ACL } from "../Api";
import AlignIcon from "./AlignIcon";

interface Props {
  acls: ACL[];
  variant: "small" | "wide";
}

export function AccessControlTable({ acls, variant }: Props) {
  const allowed = <CheckIcon fontSize="small" sx={{ color: green[500] }} />;
  const denied = <ClearIcon fontSize="small" sx={{ color: red[500] }} />;

  const wrapTitle = (icon: ReactElement, label: string) => {
    return variant === "wide" ? (
      <AlignIcon>
        {icon}
        <b>{label}</b>
      </AlignIcon>
    ) : (
      <Tooltip title={label}>{icon}</Tooltip>
    );
  };

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" padding="none">
              {wrapTitle(<PersonIcon fontSize="small" />, "User")}
            </TableCell>
            <TableCell align="center" padding="none">
              {wrapTitle(<AddIcon fontSize="small" />, "Create")}
            </TableCell>
            <TableCell align="center" padding="none">
              {wrapTitle(<SearchIcon fontSize="small" />, "Read")}
            </TableCell>
            <TableCell align="center" padding="none">
              {wrapTitle(<EditIcon fontSize="small" />, "Update")}
            </TableCell>
            <TableCell align="center" padding="none">
              {wrapTitle(<DeleteIcon fontSize="small" />, "Delete")}
            </TableCell>
            <TableCell align="center" padding="none">
              {wrapTitle(<GroupIcon fontSize="small" />, "Read ACL")}
            </TableCell>
            <TableCell align="center" padding="none">
              {wrapTitle(<GroupAddIcon fontSize="small" />, "Update ACL")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {acls.map((acl: ACL) => (
            <TableRow key={acl.userName} hover>
              <TableCell component="th" scope="row" align="center" padding="none">
                {acl.userName}
              </TableCell>
              <TableCell align="center" padding="none">
                {acl.create ? allowed : denied}
              </TableCell>
              <TableCell align="center" padding="none">
                {acl.read ? allowed : denied}
              </TableCell>
              <TableCell align="center" padding="none">
                {acl.update ? allowed : denied}
              </TableCell>
              <TableCell align="center" padding="none">
                {acl.delete ? allowed : denied}
              </TableCell>
              <TableCell align="center" padding="none">
                {acl.readACL ? allowed : denied}
              </TableCell>
              <TableCell align="center" padding="none">
                {acl.updateACL ? allowed : denied}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function AccessControl({ acls }: Props) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ content: { margin: 0 }, expanded: { margin: 0 } }}>
        <AlignIcon>
          <LockIcon />
          <Typography variant="subtitle2">Access Control</Typography>
        </AlignIcon>
      </AccordionSummary>
      <AccordionDetails>
        <AccessControlTable variant="wide" acls={acls} />
      </AccordionDetails>
    </Accordion>
  );
}
