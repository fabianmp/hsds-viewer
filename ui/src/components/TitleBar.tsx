import AppBar from "@material-ui/core/AppBar";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ComputerIcon from '@material-ui/icons/Computer';
import InfoIcon from '@material-ui/icons/Info';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import StorageIcon from '@material-ui/icons/Storage';
import React from "react";
import useSWR from 'swr';
import { Info } from "../Api";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    toolbar: {
      '& > *': {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
  }),
);

export default function TitleBar() {
  const { data: info = {
    endpoint: "",
    state: "LOADING",
    node_count: 0,
    hsds_version: "?"
  } } = useSWR<Info>("/api/info");

  const classes = useStyles();
  return (
    <AppBar position="fixed">
      <Toolbar className={classes.toolbar}>
        <Typography component="h1" variant="h6" className={classes.title}>
          <StorageIcon />{info.endpoint}
        </Typography>
        <Typography component="h1" variant="h6" className={classes.title}>
          <NetworkCheckIcon />{info.state}
        </Typography>
        <Typography component="h1" variant="h6" className={classes.title}>
          <ComputerIcon />{info.node_count} nodes
      </Typography>
        <Typography component="h1" variant="h6" className={classes.title}>
          <InfoIcon />v{info.hsds_version}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}