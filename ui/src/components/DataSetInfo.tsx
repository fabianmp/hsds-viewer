import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from '@material-ui/core/ListItemText';
import Popover from "@material-ui/core/Popover";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from "@material-ui/core/Tooltip";
import ArchiveIcon from '@material-ui/icons/Archive';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import BorderAllIcon from '@material-ui/icons/BorderAll';
import DescriptionIcon from '@material-ui/icons/Description';
import InfoIcon from '@material-ui/icons/Info';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import prettyBytes from 'pretty-bytes';
import React, { useState } from "react";
import { GroupType } from "../Api";
import Attributes from "./Attributes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
    content: {
      paddingTop: 0,
    },
    metadata: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
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

export default function DataSetInfo({ group }: Props) {
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
      <ListItem disableGutters>
        <ListItemIcon className={classes.groupIcon}><DescriptionIcon /></ListItemIcon>
        <ListItemText primary={group.name}
          secondary={`${group.type} (${prettyBytes(group.size!)})`} className={classes.groupText} />
        <ListItemSecondaryAction>
          <IconButton edge="end" onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose} onClick={handleClick}>
            <InfoIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Popover open={open} onClose={handlePopoverClose} anchorEl={anchorElement} className={clicked ? undefined : classes.popover}
        anchorOrigin={{ vertical: 'center', horizontal: 'left', }}
        transformOrigin={{ vertical: 'center', horizontal: 'right', }} disableRestoreFocus>
        <Card>
          <CardHeader title={group.name} titleTypographyProps={{ variant: 'subtitle1' }} className={classes.header} />
          <CardContent className={classes.content}>
            <Box className={classes.metadata}>
              <Tooltip title="Size">
                <Chip icon={<ArchiveIcon />} label={prettyBytes(group.size!)} variant="outlined" size="small" />
              </Tooltip>
              {!"SO".includes(group.datatype_kind!) && group.shape && <Tooltip title="Dimensions">
                <Chip icon={<AspectRatioIcon />} label={group.shape?.join('x')} variant="outlined" size="small" />
              </Tooltip>}
              {!"SO".includes(group.datatype_kind!) && group.chunks && <Tooltip title="Chunks">
                <Badge badgeContent={group.chunks} color="primary">
                  <Chip icon={<BorderAllIcon />} label={group.chunk_shape?.join('x')} variant="outlined" size="small" />
                </Badge>
              </Tooltip>}
              <Tooltip title="Data Type">
                <Chip icon={<SettingsEthernetIcon />} label={group.datatype_kind === 'S' ? "String" : group.datatype_name} variant="outlined" size="small" />
              </Tooltip>
            </Box>
          </CardContent>
          {group.attributes.length > 0 && <CardContent className={classes.content}>
            <Attributes attributes={group.attributes} />
          </CardContent>}
        </Card>
      </Popover>
    </>
  );
}
