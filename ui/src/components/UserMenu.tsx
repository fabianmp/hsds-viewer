import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
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
    mutate('/api/info');
    mutate('/api/folder/')
  };

  return (<>
    <Button onClick={users.length > 1 ? handleMenu : undefined} color="inherit" startIcon={<AccountCircleIcon />}>{username}</Button>
    {users.length > 1 && <Menu
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
    </Menu>}
  </>);
}
