import ComputerIcon from "@mui/icons-material/Computer";
import InfoIcon from "@mui/icons-material/Info";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import StorageIcon from "@mui/icons-material/Storage";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import useSWR from "swr";
import { CurrentUser } from "../Api";
import { useServerInfo } from "../Hooks";
import AlignIcon from "./AlignIcon";
import UserMenu from "./UserMenu";

export default function TitleBar() {
  const { data: features = [] } = useSWR<string[]>("/api/features");
  const { data: currentUser = { name: "<unknown>", roles: [] } } = useSWR<CurrentUser>("/api/current_user");
  const isAdmin = currentUser.roles.includes("admin");
  const hasNodeInfo = features.includes("node_info");
  const info = useServerInfo();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme: Theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ "& > *:not(:last-child)": { marginRight: 4 } }}>
        <Tooltip title="View files">
          <Button component={NavLink} to="/" color="inherit" sx={{ padding: 0 }}>
            <AlignIcon>
              <StorageIcon />
              <Typography variant="h6" noWrap>
                {info.endpoint}
              </Typography>
            </AlignIcon>
          </Button>
        </Tooltip>
        <AlignIcon>
          <NetworkCheckIcon />
          <Typography variant="h6">{info.state}</Typography>
        </AlignIcon>
        {hasNodeInfo && isAdmin ? (
          <Tooltip title="View node info">
            <Button component={NavLink} to="/nodes" color="inherit" sx={{ padding: 0 }}>
              <AlignIcon>
                <ComputerIcon />
                <Typography variant="h6" sx={{ padding: 0 }}>
                  {info.node_count} nodes
                </Typography>
              </AlignIcon>
            </Button>
          </Tooltip>
        ) : (
          <AlignIcon>
            <ComputerIcon />
            <Typography variant="h6" sx={{ padding: 0 }}>
              {info.node_count} nodes
            </Typography>
          </AlignIcon>
        )}
        <Tooltip title="Show HSDS server info">
          <Button component={NavLink} to="/info" color="inherit" sx={{ padding: 0 }}>
            <AlignIcon>
              <InfoIcon />
              <Typography variant="h6">v{info.hsds_version}</Typography>
            </AlignIcon>
          </Button>
        </Tooltip>
        <Box sx={{ flexGrow: 1 }} />
        <UserMenu username={currentUser.name} />
      </Toolbar>
    </AppBar>
  );
}
