import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { MouseEvent, useState } from "react";
import useSWR, { mutate, useSWRConfig } from "swr";

interface Props {
  username: string;
}

export default function UserMenu({ username }: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(menuAnchor);
  const { data: users = [] } = useSWR<string[]>("/api/users");
  const { cache } = useSWRConfig();

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const setCurrentUser = async (name: string) => {
    setMenuAnchor(null);
    (cache as Map<string, any>).clear();
    await fetch("/api/current_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    mutate("/api/current_user");
    mutate("/api/info");
    mutate("/api/folder/");
  };

  if (users.length > 1) {
    return (
      <>
        <Tooltip title="Switch HSDS user">
          <Button onClick={handleMenu} color="inherit" startIcon={<AccountCircleIcon />}>
            {username}
          </Button>
        </Tooltip>
        <Menu
          anchorEl={menuAnchor}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={() => setMenuAnchor(null)}
        >
          {users.map((user) => (
            <MenuItem key={user} onClick={() => setCurrentUser(user)}>
              {user}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  } else {
    return (
      <Button color="inherit" startIcon={<AccountCircleIcon />} size="large">
        {username}
      </Button>
    );
  }
}
