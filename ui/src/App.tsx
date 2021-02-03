import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import TreeView from '@material-ui/lab/TreeView';
import React, { ChangeEvent, useState } from 'react';
import useSWR from 'swr';
import { File, Node } from './Api';
import FileInfo from './components/FileInfo';
import Folder from './components/Folder';
import TitleBar from './components/TitleBar';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
      marginTop: theme.spacing(10),
    },
    column: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    }
  }),
);

export default function App() {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const { data: folders = [] } = useSWR<Node[]>('/api/list-folder/');
  const { data: fileInfo = null } = useSWR<File>(`/api/file-info${selectedFile}`)

  const classes = useStyles();
  return (
    <Box display="flex">
      <CssBaseline />
      <TitleBar />
      <Grid container className={classes.content}>
        <Grid item xs={9} className={classes.column}>
          <TreeView
            onNodeSelect={(e: ChangeEvent<{}>, s: string) => setSelectedFile(s)}
            defaultExpanded={[]}
            defaultCollapseIcon={<FolderOpenIcon />}
            defaultExpandIcon={<FolderIcon />}
            defaultEndIcon={<LibraryBooksIcon />}>
            {folders.map((folder: Node) => <Folder key={folder.path} node={folder} />)}
          </TreeView>
        </Grid>
        {fileInfo && <Grid item xs={3} className={classes.column}>
          <FileInfo file={fileInfo} />
        </Grid>}
      </Grid>
    </Box>
  );
}
