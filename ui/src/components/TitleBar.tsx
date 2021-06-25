import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import ComputerIcon from '@material-ui/icons/Computer';
import InfoIcon from '@material-ui/icons/Info';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import StorageIcon from '@material-ui/icons/Storage';
import React from "react";
import { NavLink } from "react-router-dom";
import useSWR from "swr";
import { CurrentUser } from "../Api";
import { useServerInfo } from "../Hooks";
import AlignIcon from "./AlignIcon";
import UserMenu from "./UserMenu";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    grow: {
      flexGrow: 1,
    },
    toolbarButton: {
      padding: 0
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

export default function TitleBar() {
  const classes = useStyles();
  const { data: features = [] } = useSWR<string[]>('/api/features');
  const { data: currentUser = { name: "<unknown>", roles: [] } } = useSWR<CurrentUser>('/api/current_user');
  const isAdmin = currentUser.roles.includes("admin");
  const hasNodeInfo = features.includes("node_info");
  const info = useServerInfo();

  return (
    <AppBar position="fixed" className={classes.titleBar}>
      <Toolbar className={classes.toolbarLarge}>
        <Tooltip title="View files">
          <NavLink to="/" component={IconButton} color="inherit" className={classes.toolbarButton}>
            <Typography variant="h6" noWrap>
              <AlignIcon><StorageIcon />{info.endpoint}</AlignIcon>
            </Typography>
          </NavLink>
        </Tooltip>
        <Typography variant="h6">
          <AlignIcon><NetworkCheckIcon />{info.state}</AlignIcon>
        </Typography>
        {(hasNodeInfo && isAdmin) ?
          <Tooltip title="View node info">
            <NavLink to="/nodes" component={IconButton} color="inherit" className={classes.toolbarButton}>
              <Typography variant="h6">
                <AlignIcon><ComputerIcon />{info.node_count} nodes</AlignIcon>
              </Typography>
            </NavLink>
          </Tooltip>
          :
          <Typography variant="h6">
            <AlignIcon><ComputerIcon />{info.node_count} nodes</AlignIcon>
          </Typography>
        }
        <Tooltip title="Show HSDS server info">
          <NavLink to="/info" component={IconButton} color="inherit" className={classes.toolbarButton}>
            <Typography variant="h6">
              <AlignIcon><InfoIcon />v{info.hsds_version}</AlignIcon>
            </Typography>
          </NavLink>
        </Tooltip>
        <div className={classes.grow} />
        <UserMenu username={currentUser.name} />
      </Toolbar>
    </AppBar>
  );
}
