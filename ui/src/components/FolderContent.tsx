import DeleteIcon from "@mui/icons-material/Delete";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import prettyBytes from "pretty-bytes";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useSWR, { mutate } from "swr";
import { ACL, NodeInfo } from "../Api";
import { useFolder, useSelectedDomainPath, useSelectedFolderPath } from "../Hooks";
import AccessControl from "./AccessControl";
import { DeleteOptions } from "./DeleteDialogs";
import FolderCrumbs from "./FolderCrumbs";

interface PaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function PaginationActions({ count, page, rowsPerPage, onPageChange }: PaginationActionsProps) {
  const lastPage = Math.ceil(count / rowsPerPage) - 1;

  return (
    <Box sx={{ flexShrink: 0, marginLeft: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page + 1)} disabled={page >= lastPage}>
        <KeyboardArrowRight />
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, Math.max(0, lastPage))} disabled={page >= lastPage}>
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

const sx = {
  bold: {
    fontWeight: "bold",
  },
} as const;

interface Props {
  setDeleteOptions: (options: DeleteOptions) => void;
}

export default function FolderContent({ setDeleteOptions }: Props) {
  const rowHeight = 33;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const navigate = useNavigate();
  const selectedFolderPath = useSelectedFolderPath();
  const selectedDomainPath = useSelectedDomainPath();
  const isFolderSelected = selectedFolderPath !== "/";
  const { folder: selectedFolder, isLoading: isLoadingFolder } = useFolder(selectedFolderPath);
  const { data: acls = [] } = useSWR<ACL[]>(isFolderSelected ? `/api/folder${selectedFolderPath}acl` : []);

  useEffect(() => setPage(0), [selectedFolder?.domains.length]);

  if (!isFolderSelected) {
    return <></>;
  }

  if (isLoadingFolder) {
    return (
      <>
        <Box sx={{ display: "flex" }}>
          <FolderCrumbs />
        </Box>
        <Paper sx={{ padding: 3 }}>
          Loading contents of <strong>{selectedFolderPath}</strong>...
          <LinearProgress sx={{ marginTop: 2 }} />
        </Paper>
      </>
    );
  }
  const folder = selectedFolder!;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleDomains = folder.domains.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, folder.domains.length - page * rowsPerPage);

  const handleDeleteDomainDone = () => {
    mutate(`/api/folder${selectedFolderPath}`);
    setDeleteOptions({
      path: "",
      baseUrl: "",
      handler: () => {},
    });
  };

  const handleDeleteDomain = (e: MouseEvent, path: string) => {
    e.stopPropagation();
    setDeleteOptions({
      path: path,
      baseUrl: "/api/domain",
      handler: handleDeleteDomainDone,
    });
  };

  const handleDeleteFolderDone = () => {
    const folders = selectedFolderPath.split("/").slice(0, -2);
    for (let i = 1; i <= folders.length; ++i) {
      mutate(`/api/folder${folders.slice(0, i).concat("").join("/")}`);
    }
    setDeleteOptions({
      path: "",
      baseUrl: "",
      handler: () => {},
    });
    navigate(folders.concat("").join("/"));
  };

  const handleDeleteFolder = () => {
    setDeleteOptions({
      path: selectedFolderPath,
      baseUrl: "/api/folder",
      handler: handleDeleteFolderDone,
    });
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <FolderCrumbs />
        <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteFolder}>
          Delete Folder
        </Button>
      </Box>
      {acls.length > 0 && <AccessControl acls={acls} variant="wide" />}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={sx.bold}>Name</TableCell>
              <TableCell sx={sx.bold}>Owner</TableCell>
              <TableCell sx={sx.bold}>Size</TableCell>
              <TableCell sx={sx.bold}>Created</TableCell>
              <TableCell sx={sx.bold}>Modified</TableCell>
              <TableCell sx={{ flexShrink: 1, textAlign: "right" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleDomains.map((domain: NodeInfo) => (
              <TableRow
                key={domain.name}
                hover
                onClick={() => navigate(domain.path)}
                role="checkbox"
                selected={domain.path === selectedDomainPath}
                sx={{ cursor: "pointer" }}
              >
                <TableCell component="th" scope="row">
                  {domain.name}
                </TableCell>
                <TableCell>{domain.owner}</TableCell>
                <TableCell>{prettyBytes(domain.total_size)}</TableCell>
                <TableCell>{new Date(domain.created).toLocaleString()}</TableCell>
                <TableCell>{new Date(domain.modified).toLocaleString()}</TableCell>
                <TableCell sx={{ flexShrink: 1, textAlign: "right" }}>
                  <Tooltip title="Delete file">
                    <IconButton color="error" sx={{ padding: 0 }} onClick={(e) => handleDeleteDomain(e, domain.path)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: rowHeight * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
                count={folder.domains.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                colSpan={5}
                ActionsComponent={PaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
