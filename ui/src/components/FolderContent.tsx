import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from "@material-ui/core/Paper";
import Snackbar from '@material-ui/core/Snackbar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from '@material-ui/icons/Delete';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Alert from '@material-ui/lab/Alert';
import prettyBytes from "pretty-bytes";
import React, { useEffect } from "react";
import { useHistory } from 'react-router';
import { mutate } from "swr";
import { Folder, NodeInfo } from '../Api';
import { useSelectedDomainPath, useSelectedFolderPath } from '../Hooks';


const usePaginationStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  }),
);

interface PaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function PaginationActions({ count, page, rowsPerPage, onChangePage }: PaginationActionsProps) {
  const classes = usePaginationStyles();
  const lastPage = Math.ceil(count / rowsPerPage) - 1;

  return (
    <div className={classes.root}>
      <IconButton onClick={e => onChangePage(e, 0)} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={e => onChangePage(e, page - 1)} disabled={page === 0} >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={e => onChangePage(e, page + 1)} disabled={page >= lastPage}>
        <KeyboardArrowRight />
      </IconButton>
      <IconButton onClick={e => onChangePage(e, Math.max(0, lastPage))} disabled={page >= lastPage}>
        <LastPageIcon />
      </IconButton>
    </div>
  );
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actions: {
      flexShrink: 1,
      textAlign: "right",
    },
    deleteButton: {
      padding: 0,
    },
  }),
);


interface Props {
  folder: Folder
}

export default function FolderContent({ folder }: Props) {
  const classes = useStyles();
  const rowHeight = 33;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [deleteDomain, setDeleteDomain] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [deleteInProgress, setDeleteInProgress] = React.useState(false);
  const history = useHistory();
  const selectedFolderPath = useSelectedFolderPath();
  const selectedDomainPath = useSelectedDomainPath();

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

  const handleErrorMessage = () => {
    setErrorMessage("");
  }

  const handleDeleteDomain = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    setDeleteDomain(path);
  }

  const handleConfirmDeleteDomain = async () => {
    if (deleteDomain.length === 0) {
      return
    }
    setDeleteInProgress(true);
    const response = await fetch(`/api/domain${deleteDomain}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok && response.status === 403) {
      setErrorMessage(`You are not allowed to delete ${deleteDomain}`);
    };
    mutate(`/api/folder${folder.path}`);
    history.push(selectedFolderPath);
    setDeleteDomain("");
    setDeleteInProgress(false);
  };

  const handleSelectDomain = (path: string) => {
    history.push(path);
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
            <TableCell className={classes.actions}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleDomains.map((domain: NodeInfo) =>
            <TableRow key={domain.name} hover onClick={() => handleSelectDomain(domain.path)} role="checkbox" selected={domain.path === selectedDomainPath}>
              <TableCell component="th" scope="row">{domain.name}</TableCell>
              <TableCell>{domain.owner}</TableCell>
              <TableCell>{prettyBytes(domain.total_size)}</TableCell>
              <TableCell>{new Date(domain.created).toLocaleString()}</TableCell>
              <TableCell>{new Date(domain.modified).toLocaleString()}</TableCell>
              <TableCell className={classes.actions}>
                <Tooltip title="Delete file">
                  <IconButton color="secondary" className={classes.deleteButton} onClick={(e) => handleDeleteDomain(e, domain.path)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
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
              page={page} onChangePage={handleChangePage} onChangeRowsPerPage={handleChangeRowsPerPage} colSpan={5}
              ActionsComponent={PaginationActions} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    <Dialog open={deleteDomain.length > 0 && !deleteInProgress} onClose={() => setDeleteDomain("")}>
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>Do you really want to delete <strong>{deleteDomain}</strong>?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDomain("")} color="primary" autoFocus>
          Cancel
        </Button>
        <Button onClick={handleConfirmDeleteDomain} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    <Dialog open={deleteInProgress}>
      <DialogTitle>Please wait</DialogTitle>
      <DialogContent>
        <DialogContentText>Deleting folder <strong>{deleteDomain}</strong>...</DialogContentText>
        <DialogContentText><LinearProgress /></DialogContentText>
      </DialogContent>
    </Dialog>
    <Snackbar open={errorMessage.length > 0} autoHideDuration={5000} onClose={handleErrorMessage}>
      <Alert onClose={handleErrorMessage} severity="error" variant="filled">{errorMessage}</Alert>
    </Snackbar>
  </>);
}
