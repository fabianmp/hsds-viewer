import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Alert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { ACL, Domain, Folder } from '../Api';
import { useServerInfo } from '../Hooks';
import AccessControl from './AccessControl';
import DomainInfo from './DomainInfo';
import FolderContent from './FolderContent';
import FolderCrumbs from './FolderCrumbs';
import FolderTree from './FolderTree';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    column: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      '& > * + *': {
        marginTop: theme.spacing(1),
      },
    },
    drawer: {
      width: 350,
    },
    drawerPaper: {
      overflow: 'auto',
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
    },
    crumbContainer: {
      display: 'flex',
    },
    crumbs: {
      flexGrow: 1
    }
  }),
);

export default function HsdsData() {
  const [selectedFolderPath, setSelectedFolderPath] = useState<string>("");
  const [selectedDomainPath, setSelectedDomainPath] = useState<string>("");
  const { data: rootFolder = undefined } = useSWR<Folder>('/api/folder/');
  const { data: selectedFolder = null } = useSWR<Folder>(selectedFolderPath ? `/api/folder${selectedFolderPath}/` : null)
  const { data: selectedDomain = null } = useSWR<Domain>(selectedDomainPath ? `/api/domain${selectedDomainPath}` : null)
  const { data: acls = [] } = useSWR<ACL[]>(selectedFolderPath ? `/api/folder${selectedFolderPath}/acl` : [])
  const info = useServerInfo();
  const [deleteFolder, setDeleteFolder] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [deleteInProgress, setDeleteInProgress] = React.useState(false);

  useEffect(() => {
    mutate(`/api/folder${selectedFolderPath}/`);
    mutate(`/api/folder${selectedFolderPath}/acl`);
    mutate(`/api/domain${selectedDomainPath}`);
    mutate(`/api/domain${selectedDomainPath}/acl`);
  }, [info.username, selectedFolderPath, selectedDomainPath])

  const handleSelectFolder = (path: string) => {
    setSelectedFolderPath(path);
    setSelectedDomainPath("");
  }

  const handleErrorMessage = () => {
    setErrorMessage("");
  }

  const handleDeleteFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteFolder(selectedFolderPath);
  }

  const handleConfirmDeleteDomain = async () => {
    if (deleteFolder.length === 0) {
      return
    }
    setDeleteInProgress(true)
    const response = await fetch(`/api/folder${deleteFolder}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok && response.status === 403) {
      setErrorMessage(`You are not allowed to delete ${deleteFolder}`);
    };

    const folders = deleteFolder.split('/');
    for (let i = 1; i < folders.length; ++i) {
      mutate(`/api/folder${folders.slice(0, i).join('/')}`)
    }
    setDeleteFolder("");
    setSelectedDomainPath("");
    setSelectedFolderPath(folders.slice(0, -1).join('/'));
    setDeleteInProgress(false);
  };

  const classes = useStyles();
  return (<>
    <Drawer variant="permanent" className={classes.drawer} classes={{ paper: clsx(classes.drawer, classes.drawerPaper) }} open>
      {rootFolder && <FolderTree folder={rootFolder} selectedFolderPath={selectedFolderPath} handleNodeSelect={handleSelectFolder} />}
    </Drawer>
    <Grid container>
      <Grid item xs={12} md={8} xl={9} className={classes.column}>
        {selectedFolder && <>
          <div className={classes.crumbContainer}>
            <FolderCrumbs selectedFolderPath={selectedFolderPath} selectPath={handleSelectFolder} className={classes.crumbs} />
            <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={handleDeleteFolder}>Delete Folder</Button>
          </div>
          {acls.length > 0 && <AccessControl acls={acls} variant="wide" />}
          <FolderContent folder={selectedFolder} handleSelect={setSelectedDomainPath} selected={selectedDomainPath} />
        </>}
      </Grid>
      {selectedDomain && <Grid item xs={12} md={4} xl={3} className={classes.column}>
        <DomainInfo domain={selectedDomain} />
      </Grid>}
    </Grid>
    <Dialog open={deleteFolder.length > 0 && !deleteInProgress} onClose={() => setDeleteFolder("")}>
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>Do you really want to delete <strong>{deleteFolder}</strong>?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteFolder("")} color="primary" autoFocus>
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
        <DialogContentText>Deleting folder <strong>{deleteFolder}</strong>...</DialogContentText>
        <DialogContentText><LinearProgress /></DialogContentText>
      </DialogContent>
    </Dialog>
    <Snackbar open={errorMessage.length > 0} autoHideDuration={5000} onClose={handleErrorMessage}>
      <Alert onClose={handleErrorMessage} severity="error" variant="filled">{errorMessage}</Alert>
    </Snackbar>
  </>);
}
