import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import React, { MouseEvent, useState } from "react";
import useSWR, { cache, mutate } from "swr";

interface Props {
  username: string
}

export default function UserMenu({ username }: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(menuAnchor);
  const { data: users = [] } = useSWR<string[]>('/api/users');

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const setCurrentUser = async (name: string) => {
    setMenuAnchor(null);
    cache.clear();
    await fetch('/api/current_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    mutate('/api/current_user');
    mutate('/api/info');
    mutate('/api/folder/')
  };

  if (users.length > 1) {
    return (<>
      <Tooltip title="Switch HSDS user">
        <Button onClick={handleMenu} color="inherit" startIcon={<AccountCircleIcon />}>{username}</Button>
      </Tooltip>
      <Menu
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={() => setMenuAnchor(null)}
      >
        {users.map(user => <MenuItem key={user} onClick={() => setCurrentUser(user)}>{user}</MenuItem>)}
      </Menu>
    </>);
  } else {
    return <Button color="inherit" startIcon={<AccountCircleIcon />}>{username}</Button>
  }
}
