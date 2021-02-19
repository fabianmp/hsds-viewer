import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CodeIcon from '@material-ui/icons/Code';
import InfoIcon from '@material-ui/icons/Info';
import React, { useState } from "react";
import { GroupType } from "../Api";
import Attributes from './Attributes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
    content: {
      paddingTop: 0,
    },
    groupText: {
      marginTop: 0,
      marginBottom: 0,
    },
    groupIcon: {
      minWidth: theme.spacing(5),
    },
    popover: {
      pointerEvents: 'none',
    },
  }),
);

interface Props {
  group: GroupType
}

export default function GroupInfo({ group }: Props) {
  const classes = useStyles();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [clicked, setClicked] = useState<boolean>(false);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (anchorElement === null) setAnchorElement(event.currentTarget);
    setClicked(true);
  };

  const handlePopoverClose = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (clicked && event.type === 'mouseleave') return;
    setClicked(false);
    setAnchorElement(null);
  };

  const open = Boolean(anchorElement)

  return (
    <>
      <ListItem disableGutters key={group.name}>
        <ListItemIcon className={classes.groupIcon}><CodeIcon /></ListItemIcon>
        <ListItemText primary={group.name} secondary={group.type} className={classes.groupText} />
        {group.attributes.length > 0 && <ListItemSecondaryAction>
          <IconButton edge="end" onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose} onClick={handleClick}>
            <InfoIcon />
          </IconButton>
        </ListItemSecondaryAction>}
      </ListItem>
      <Popover open={open} onClose={handlePopoverClose} anchorEl={anchorElement} className={clicked ? undefined : classes.popover}
        anchorOrigin={{ vertical: 'center', horizontal: 'left', }}
        transformOrigin={{ vertical: 'center', horizontal: 'right', }} disableRestoreFocus>
        <Card>
          <CardHeader title={group.name} titleTypographyProps={{ variant: 'subtitle1' }} className={classes.header} />
          {group.attributes && <CardContent className={classes.content}>
            <Attributes attributes={group.attributes} />
          </CardContent>}
        </Card>
      </Popover>
    </>
  )
}
