import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from "@material-ui/core/TableRow";
import prettyBytes from "pretty-bytes";
import React, { useEffect } from "react";
import { Folder, NodeInfo } from '../Api';

interface Props {
  folder: Folder
  selected: string
  handleSelect: (path: string) => void
}

export default function FolderContent({ folder, handleSelect, selected }: Props) {
  const rowHeight = 33;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const visibleDomains = folder.domains.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, folder.domains.length - page * rowsPerPage);

  useEffect(() => setPage(0), [folder.domains.length]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (<>
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
          {visibleDomains.map((domain: NodeInfo) =>
            <TableRow key={domain.name} hover onClick={() => handleSelect(domain.path)} role="checkbox" selected={domain.path === selected}>
              <TableCell component="th" scope="row">{domain.name}</TableCell>
              <TableCell>{domain.owner}</TableCell>
              <TableCell>{prettyBytes(domain.total_size)}</TableCell>
              <TableCell>{new Date(domain.created).toLocaleString()}</TableCell>
              <TableCell>{new Date(domain.modified).toLocaleString()}</TableCell>
            </TableRow>)}
          {emptyRows > 0 && (
            <TableRow style={{ height: rowHeight * emptyRows }}>
              <TableCell colSpan={5} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination rowsPerPageOptions={[5, 10, 15, 20, 50, 100]} count={folder.domains.length} rowsPerPage={rowsPerPage}
              page={page} onChangePage={handleChangePage} onChangeRowsPerPage={handleChangeRowsPerPage} colSpan={5} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  </>);
}
