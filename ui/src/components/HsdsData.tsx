import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
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

  const classes = useStyles();
  return (<>
    <Drawer variant="permanent" className={classes.drawer} classes={{ paper: clsx(classes.drawer, classes.drawerPaper) }} open>
      {rootFolder && <FolderTree folder={rootFolder} selectedFolderPath={selectedFolderPath} handleNodeSelect={handleSelectFolder} />}
    </Drawer>
    <Grid container>
      <Grid item xs={12} md={8} xl={9} className={classes.column}>
        {selectedFolder && <FolderCrumbs selectedFolderPath={selectedFolderPath} selectPath={handleSelectFolder} />}
        {selectedFolder && acls.length > 0 && <AccessControl acls={acls} variant="wide" />}
        {selectedFolder && <FolderContent folder={selectedFolder} handleSelect={setSelectedDomainPath} selected={selectedDomainPath} />}
      </Grid>
      {selectedDomain && <Grid item xs={12} md={4} xl={3} className={classes.column}>
        <DomainInfo domain={selectedDomain} />
      </Grid>}
    </Grid>
  </>);
}
