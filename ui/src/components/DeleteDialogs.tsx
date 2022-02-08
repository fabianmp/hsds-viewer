import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";

export interface DeleteOptions {
  path: string;
  baseUrl: string;
  handler: () => void;
}

interface Props {
  deleteBaseUrl: string;
  deletePath: string;
  cancel: () => void;
  done: () => void;
}

export default function DeleteDialogs({ deleteBaseUrl, deletePath, cancel, done }: Props) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const showDeleteDialog = deletePath.length > 0 && !deleteInProgress;

  const handleConfirmDeletion = async () => {
    if (deletePath.length === 0) {
      return;
    }
    setDeleteInProgress(true);
    const response = await fetch(`${deleteBaseUrl}${deletePath}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok && response.status === 403) {
      setErrorMessage(`You are not allowed to delete ${deletePath}`);
    }

    done();
    setDeleteInProgress(false);
  };

  return (
    <>
      <Dialog open={showDeleteDialog}>
        <DialogTitle>Please confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to delete <strong>{deletePath}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleConfirmDeletion} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteInProgress}>
        <DialogTitle>Please wait</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting <strong>{deletePath}</strong>...
          </DialogContentText>
          <DialogContentText>
            <LinearProgress />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Snackbar open={errorMessage.length > 0} autoHideDuration={5000} onClose={() => setErrorMessage("")}>
        <Alert onClose={() => setErrorMessage("")} severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
