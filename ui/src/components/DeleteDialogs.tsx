import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import React, { useState } from 'react';

export interface DeleteOptions {
  path: string
  baseUrl: string
  handler: () => void
};

interface Props {
  deleteBaseUrl: string
  deletePath: string
  cancel: () => void
  done: () => void
}

export default function DeleteDialogs({ deleteBaseUrl, deletePath, cancel, done }: Props) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const showDeleteDialog = deletePath.length > 0 && !deleteInProgress;

  const handleConfirmDeletion = async () => {
    if (deletePath.length === 0) {
      return
    }
    setDeleteInProgress(true)
    const response = await fetch(`${deleteBaseUrl}${deletePath}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok && response.status === 403) {
      setErrorMessage(`You are not allowed to delete ${deletePath}`);
    };

    done();
    setDeleteInProgress(false);
  };

  return (<>
    <Dialog open={showDeleteDialog}>
      <DialogTitle>Please confirm</DialogTitle>
      <DialogContent>
        <DialogContentText>Do you really want to delete <strong>{deletePath}</strong>?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel} color="primary" autoFocus>Cancel</Button>
        <Button onClick={handleConfirmDeletion} color="secondary">Delete</Button>
      </DialogActions>
    </Dialog>
    <Dialog open={deleteInProgress}>
      <DialogTitle>Please wait</DialogTitle>
      <DialogContent>
        <DialogContentText>Deleting <strong>{deletePath}</strong>...</DialogContentText>
        <DialogContentText><LinearProgress /></DialogContentText>
      </DialogContent>
    </Dialog>
    <Snackbar open={errorMessage.length > 0} autoHideDuration={5000} onClose={() => setErrorMessage("")}>
      <Alert onClose={() => setErrorMessage("")} severity="error" variant="filled">{errorMessage}</Alert>
    </Snackbar>
  </>);
}