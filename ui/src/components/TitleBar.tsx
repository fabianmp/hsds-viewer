import AppBar from "@material-ui/core/AppBar";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ComputerIcon from '@material-ui/icons/Computer';
import InfoIcon from '@material-ui/icons/Info';
import MenuIcon from '@material-ui/icons/Menu';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import StorageIcon from '@material-ui/icons/Storage';
import React from "react";
import useSWR from 'swr';
import { ServerInfo } from "../Api";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    grow: {
      flexGrow: 1,
    },
    toolbarSmall: {
      '& > *': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    toolbarLarge: {
      '& > *': {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
  }),
);

interface Props {
  toggleMenu: () => void
}

export default function TitleBar({ toggleMenu }: Props) {
  const { data: info = {
    endpoint: "",
    state: "LOADING",
    node_count: 0,
    hsds_version: "?"
  } } = useSWR<ServerInfo>("/api/info");

  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.titleBar}>
      <Hidden lgUp implementation="css">
        <Toolbar className={classes.toolbarSmall}>
          <IconButton color="inherit" edge="start" onClick={toggleMenu}>
            <Typography variant="h6" className={classes.title}>
              <MenuIcon />Folders
            </Typography>
          </IconButton>
          <div className={classes.grow} />
          <Typography variant="h6" className={classes.title} noWrap>
            {info.endpoint}
          </Typography>
        </Toolbar>
      </Hidden>
      <Hidden mdDown implementation="css">
        <Toolbar className={classes.toolbarLarge}>
          <Typography variant="h6" className={classes.title} noWrap>
            <StorageIcon />{info.endpoint}
          </Typography>
          <Typography variant="h6" className={classes.title}>
            <NetworkCheckIcon />{info.state}
          </Typography>
          <Typography variant="h6" className={classes.title}>
            <ComputerIcon />{info.node_count} nodes
          </Typography>
          <Typography variant="h6" className={classes.title}>
            <InfoIcon />v{info.hsds_version}
          </Typography>
        </Toolbar>
      </Hidden>
    </AppBar>
  );
}