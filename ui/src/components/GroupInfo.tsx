import Chip from '@material-ui/core/Chip';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CodeIcon from '@material-ui/icons/Code';
import ListIcon from '@material-ui/icons/List';
import React from "react";
import { GroupType } from "../Api";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    groupText: {
      marginTop: 0,
      marginBottom: 0,
    },
    groupIcon: {
      minWidth: theme.spacing(5),
    },
  }),
);

interface Props {
  selected: boolean
  group: GroupType
  setSelectedGroup: (group: GroupType) => void
}

export default function GroupInfo({ selected, group, setSelectedGroup }: Props) {
  const classes = useStyles();

  const createItem = (children: JSX.Element) => group.attributes.length > 0
    ? <MenuItem selected={selected} disableGutters key={group.name} onClick={() => setSelectedGroup(group)}>{children}</MenuItem>
    : <ListItem selected={selected} disableGutters key={group.name}>{children}</ListItem>;

  return createItem(<>
    <ListItemIcon className={classes.groupIcon}><CodeIcon /></ListItemIcon>
    <ListItemText primary={group.name} secondary={group.type} className={classes.groupText} />
    {group.attributes.length > 0 && <Tooltip title="Other attributes">
      <Chip icon={<ListIcon />} label="Attributes" variant="outlined" size="small" />
    </Tooltip>}
  </>);
}
