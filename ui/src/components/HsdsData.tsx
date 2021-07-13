import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Folder } from '../Api';
import { useSelectedDomainPath, useSelectedFolderPath, useServerInfo } from '../Hooks';
import DeleteDialogs, { DeleteOptions } from './DeleteDialogs';
import FileContent from './FileContent';
import FolderContent from './FolderContent';
import FolderTree from './FolderTree';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(1),
      },
    },
    drawer: {
      width: 350,
    },
    drawerPaper: {
      width: 350,
      overflow: 'auto',
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
    },
  }),
);

const emptyDeleteOptions: DeleteOptions = {
  path: "",
  baseUrl: "",
  handler: () => { }
};

export default function HsdsData() {
  const selectedFolderPath = useSelectedFolderPath();
  const selectedDomainPath = useSelectedDomainPath();
  const { data: rootFolder = undefined } = useSWR<Folder>('/api/folder/');
  const info = useServerInfo();
  const [deleteOptions, setDeleteOptions] = useState<DeleteOptions>(emptyDeleteOptions);

  useEffect(() => {
    mutate(`/api/folder${selectedFolderPath}`);
    mutate(`/api/folder${selectedFolderPath}acl`);
    mutate(`/api/domain${selectedDomainPath}`);
    mutate(`/api/domain${selectedDomainPath}/acl`);
  }, [info.username, selectedFolderPath, selectedDomainPath])

  const classes = useStyles();
  return (<>
    <Drawer variant="permanent" className={classes.drawer} classes={{ paper: classes.drawerPaper }} open>
      {rootFolder && <FolderTree folder={rootFolder} />}
    </Drawer>
    <Box className={classes.content}>
      {selectedDomainPath
        ? <FileContent setDeleteOptions={setDeleteOptions} />
        : <FolderContent setDeleteOptions={setDeleteOptions} />}
    </Box>
    <DeleteDialogs deletePath={deleteOptions.path} deleteBaseUrl={deleteOptions.baseUrl} cancel={() => setDeleteOptions(emptyDeleteOptions)} done={deleteOptions.handler} />
  </>);
}
