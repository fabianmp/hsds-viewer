import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import useSWR, { mutate } from 'swr';
import { ACL, Domain, Folder, ServerInfo } from './Api';
import AccessControl from './components/AccessControl';
import DomainInfo from './components/DomainInfo';
import FolderContent from './components/FolderContent';
import FolderCrumbs from './components/FolderCrumbs';
import FolderTree from './components/FolderTree';
import NodeInfo from './components/NodeInfo';
import ServerInfoPage from './components/ServerInfoPage';
import TitleBar from './components/TitleBar';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      paddingTop: theme.spacing(10),
    },
    column: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      '& > * + *': {
        marginTop: theme.spacing(1),
      },
    },
    drawerSmall: {
      minWidth: '50vw',
    },
    drawerLarge: {
      width: 350,
    },
    drawerPaperSmall: {
      overflow: 'auto',
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    drawerPaperLarge: {
      overflow: 'auto',
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
    },
    breadCrumbs: {
      padding: theme.spacing(1),
    },
  }),
);

export default function App() {
  const [selectedFolderPath, setSelectedFolderPath] = useState<string>("");
  const [selectedDomainPath, setSelectedDomainPath] = useState<string>("");
  const { data: rootFolder = undefined } = useSWR<Folder>('/api/folder/');
  const { data: selectedFolder = null } = useSWR<Folder>(selectedFolderPath ? `/api/folder${selectedFolderPath}/` : null)
  const { data: selectedDomain = null } = useSWR<Domain>(selectedDomainPath ? `/api/domain${selectedDomainPath}` : null)
  const { data: acls = [] } = useSWR<ACL[]>(selectedFolderPath ? `/api/folder${selectedFolderPath}/acl` : [])
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: info = {
    version: "<unknown>",
    endpoint: "",
    state: "LOADING",
    node_count: 0,
    hsds_version: "?",
    username: "<unknown>"
  } } = useSWR<ServerInfo>("/api/info");

  useEffect(() => {
    mutate(`/api/folder${selectedFolderPath}/`);
    mutate(`/api/folder${selectedFolderPath}/acl`);
    mutate(`/api/domain${selectedDomainPath}`);
    mutate(`/api/domain${selectedDomainPath}/acl`);
  }, [info.username, selectedFolderPath, selectedDomainPath])

  const handleDrawerToggle = useCallback(() => setDrawerOpen(!drawerOpen), [drawerOpen]);

  const classes = useStyles();
  return (
    <Router>
      <Box display="flex" className={classes.content}>
        <CssBaseline />
        <TitleBar toggleMenu={handleDrawerToggle} info={info} />
        <Switch>
          <Route path="/info">
            <ServerInfoPage info={info} />
          </Route>
          <Route path="/nodes">
            <NodeInfo />
          </Route>
          <Route path="/:path*">
            <Hidden lgUp implementation="css">
              <Drawer variant="temporary" className={classes.drawerSmall} classes={{ paper: clsx(classes.drawerSmall, classes.drawerPaperSmall) }}
                open={drawerOpen} onClose={handleDrawerToggle}>
                {rootFolder && <FolderTree folder={rootFolder} selectedFolderPath={selectedFolderPath} handleNodeSelect={setSelectedFolderPath} />}
              </Drawer>
            </Hidden>
            <Hidden mdDown implementation="css">
              <Drawer variant="permanent" className={classes.drawerLarge} classes={{ paper: clsx(classes.drawerLarge, classes.drawerPaperLarge) }} open>
                {rootFolder && <FolderTree folder={rootFolder} selectedFolderPath={selectedFolderPath} handleNodeSelect={setSelectedFolderPath} />}
              </Drawer>
            </Hidden>
            <Grid container>
              <Grid item xs={12} md={8} xl={9} className={classes.column}>
                {selectedFolder && <FolderCrumbs selectedFolderPath={selectedFolderPath} selectPath={setSelectedFolderPath} />}
                {selectedFolder && acls.length > 0 && <AccessControl acls={acls} variant="wide" />}
                {selectedFolder && <FolderContent folder={selectedFolder} handleSelect={setSelectedDomainPath} selected={selectedDomainPath} />}
              </Grid>
              {selectedDomain && <Grid item xs={12} md={4} xl={3} className={classes.column}>
                <DomainInfo domain={selectedDomain} />
              </Grid>}
            </Grid>
          </Route>
        </Switch>
      </Box>
    </Router>
  );
}
