import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from "@material-ui/core/Paper";
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
import prettyBytes from "pretty-bytes";
import React, { useEffect } from "react";
import { useHistory } from 'react-router';
import useSWR, { mutate } from "swr";
import { ACL, NodeInfo } from '../Api';
import { useFolder, useSelectedDomainPath, useSelectedFolderPath } from '../Hooks';
import AccessControl from './AccessControl';
import { DeleteOptions } from './DeleteDialogs';
import FolderCrumbs from './FolderCrumbs';


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
    crumbContainer: {
      display: 'flex',
    },
    crumbs: {
      flexGrow: 1
    },
    loading: {
      padding: theme.spacing(3),
    },
    progress: {
      marginTop: theme.spacing(2),
    },
    row: {
      cursor: 'pointer'
    }
  }),
);


interface Props {
  setDeleteOptions: (options: DeleteOptions) => void
}

export default function FolderContent({ setDeleteOptions }: Props) {
  const classes = useStyles();
  const rowHeight = 33;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const history = useHistory();
  const selectedFolderPath = useSelectedFolderPath();
  const selectedDomainPath = useSelectedDomainPath();
  const isFolderSelected = selectedFolderPath !== "/";
  const { folder: selectedFolder, isLoading: isLoadingFolder } = useFolder(selectedFolderPath);
  const { data: acls = [] } = useSWR<ACL[]>(isFolderSelected ? `/api/folder${selectedFolderPath}acl` : [])

  useEffect(() => setPage(0), [selectedFolder?.domains.length]);

  if (!isFolderSelected) {
    return (<></>);
  }

  if (isLoadingFolder) {
    return (<>
      <div className={classes.crumbContainer}>
        <FolderCrumbs className={classes.crumbs} />
      </div>
      <Paper className={classes.loading}>
        Loading contents of <strong>{selectedFolderPath}</strong>...
        <LinearProgress className={classes.progress} />
      </Paper>
    </>);
  }
  const folder = selectedFolder!;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      handler: () => { }
    });
  };

  const handleDeleteDomain = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    setDeleteOptions({
      path: path,
      baseUrl: "/api/domain",
      handler: handleDeleteDomainDone
    })
  }

  const handleDeleteFolderDone = () => {
    const folders = selectedFolderPath.split('/').slice(0, -2);
    for (let i = 1; i <= folders.length; ++i) {
      mutate(`/api/folder${folders.slice(0, i).concat('').join('/')}`);
    }
    setDeleteOptions({
      path: "",
      baseUrl: "",
      handler: () => { }
    });
    history.push(folders.concat('').join('/'));
  }

  const handleDeleteFolder = () => {
    setDeleteOptions({
      path: selectedFolderPath,
      baseUrl: "/api/folder",
      handler: handleDeleteFolderDone
    })
  }

  return (<>
    <div className={classes.crumbContainer}>
      <FolderCrumbs className={classes.crumbs} />
      <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={handleDeleteFolder}>Delete Folder</Button>
    </div>
    {acls.length > 0 && <AccessControl acls={acls} variant="wide" />}
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
            <TableRow key={domain.name} hover onClick={() => history.push(domain.path)} role="checkbox"
              selected={domain.path === selectedDomainPath} className={classes.row}>
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
  </>);
}
