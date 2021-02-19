import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CodeIcon from '@material-ui/icons/Code';
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
  group: GroupType
}

export default function GroupInfo({ group }: Props) {
  const classes = useStyles();

  return (
    <ListItem disableGutters key={group.name}>
      <ListItemIcon className={classes.groupIcon}><CodeIcon /></ListItemIcon>
      <ListItemText primary={group.name} secondary={group.type} className={classes.groupText} />
    </ListItem>
  )
}
