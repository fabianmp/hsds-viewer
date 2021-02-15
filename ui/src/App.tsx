import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import useSWR from 'swr';
import { Domain, Folder } from './Api';
import AccessControl from './components/AccessControl';
import DomainInfo from './components/DomainInfo';
import FolderContent from './components/FolderContent';
import FolderTree from './components/FolderTree';
import TitleBar from './components/TitleBar';
import HomeIcon from '@material-ui/icons/Home';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
      paddingTop: theme.spacing(10),
    },
    column: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
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
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    breadCrumbs: {
      padding: theme.spacing(1),
    },
    homeIcon: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

export default function App() {
  const [selectedFolderPath, setSelectedFolderPath] = useState<string>("");
  const [selectedDomainPath, setSelectedDomainPath] = useState<string>("");
  const { data: folder = undefined } = useSWR<Folder>('/api/folder/');
  const { data: selectedFolder = null } = useSWR<Folder>(selectedFolderPath ? `/api/folder${selectedFolderPath}/` : null)
  const { data: selectedDomain = null } = useSWR<Domain>(selectedDomainPath ? `/api/domain${selectedDomainPath}` : null)
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => setDrawerOpen(!drawerOpen), [drawerOpen]);
  const folderNames = selectedFolderPath.split("/").filter(x => x);
  const breadCrumbs = folderNames.map((n, i) => [n, `/${folderNames.slice(0, i + 1).join("/")}/`]);

  const classes = useStyles();
  return (
    <Box display="flex">
      <CssBaseline />
      <TitleBar toggleMenu={handleDrawerToggle} />
      <Hidden lgUp implementation="css">
        <Drawer variant="temporary" className={classes.drawerSmall} classes={{ paper: clsx(classes.drawerSmall, classes.drawerPaperSmall) }}
          open={drawerOpen} onClose={handleDrawerToggle}>
          {folder && <FolderTree folder={folder} handleNodeSelect={setSelectedFolderPath} />}
        </Drawer>
      </Hidden>
      <Hidden mdDown implementation="css">
        <Drawer variant="permanent" className={classes.drawerLarge} classes={{ paper: clsx(classes.drawerLarge, classes.drawerPaperLarge) }} open>
          {folder && <FolderTree folder={folder} handleNodeSelect={setSelectedFolderPath} />}
        </Drawer>
      </Hidden>
      <Grid container className={classes.content}>
        <Grid item xs={12} md={8} xl={9} className={classes.column}>
          {breadCrumbs.length > 0 && <Box className={classes.breadCrumbs}>
            <Breadcrumbs aria-label="breadcrumb">
              <Typography className={classes.homeIcon}><HomeIcon fontSize="small" /> HSDS</Typography>
              {breadCrumbs.slice(0, -1).map(([n, p]) => <Link href="#" key={p} onClick={() => setSelectedFolderPath(p)}>{n}</Link>)}
              <Typography>{breadCrumbs[breadCrumbs.length - 1][0]}</Typography>
            </Breadcrumbs>
          </Box>}
          {selectedFolder && selectedFolder.acls && <AccessControl acls={selectedFolder.acls} />}
          {selectedFolder && <FolderContent folder={selectedFolder} handleSelect={setSelectedDomainPath} selected={selectedDomainPath} />}
        </Grid>
        {selectedDomain && <Grid item xs={12} md={4} xl={3} className={classes.column}>
          <DomainInfo domain={selectedDomain} />
        </Grid>}
      </Grid>
    </Box>
  );
}
