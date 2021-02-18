import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from "@material-ui/core/ListSubheader";
import Popover from "@material-ui/core/Popover";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from "@material-ui/core/Tooltip";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ArchiveIcon from '@material-ui/icons/Archive';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import BorderAllIcon from '@material-ui/icons/BorderAll';
import CodeIcon from '@material-ui/icons/Code';
import DescriptionIcon from '@material-ui/icons/Description';
import InfoIcon from '@material-ui/icons/Info';
import PersonIcon from '@material-ui/icons/Person';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import UpdateIcon from '@material-ui/icons/Update';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import prettyBytes from 'pretty-bytes';
import React, { useState } from "react";
import { Domain, GroupType } from "../Api";

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
    groupHeader: {
      lineHeight: 2,
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

interface GroupInfoProps {
  group: GroupType
}

function GroupInfo({ group }: GroupInfoProps) {
  const classes = useStyles();

  return (
    <ListItem disableGutters key={group.name}>
      <ListItemIcon className={classes.groupIcon}><CodeIcon /></ListItemIcon>
      <ListItemText primary={group.name} secondary={group.type} className={classes.groupText} />
    </ListItem>
  )
}

function DataSetInfo({ group }: GroupInfoProps) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ListItem disableGutters>
        <ListItemIcon className={classes.groupIcon}><DescriptionIcon /></ListItemIcon>
        <ListItemText primary={group.name}
          secondary={`${group.type} (${prettyBytes(group.size!)})`} className={classes.groupText} />
        <ListItemSecondaryAction>
          <IconButton edge="end" onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
            <InfoIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Popover open={Boolean(anchorEl)} onClose={handlePopoverClose} anchorEl={anchorEl} className={classes.popover}
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
        </Card>
      </Popover>
    </>
  );
}

interface Props {
  domain: Domain
}

export default function DomainInfo({ domain }: Props) {
  const classes = useStyles();
  return (
    <Card>
      <CardHeader title={domain.filename} subheader={`${domain.domain}/`} titleTypographyProps={{ variant: 'body1' }}
        subheaderTypographyProps={{ variant: 'body2' }} className={classes.header} />
      <CardContent className={classes.content}>
        <Box className={classes.metadata}>
          <Tooltip title="MD5">
            <Chip icon={<VerifiedUserIcon />} label={domain.md5_sum} variant="outlined" size="small" />
          </Tooltip>
          <Tooltip title="Owner">
            <Chip icon={<PersonIcon />} label={domain.owner} variant="outlined" size="small" />
          </Tooltip>
          <Tooltip title="Created">
            <Chip icon={<AccessTimeIcon />} label={new Date(domain.created).toLocaleString()} variant="outlined" size="small" />
          </Tooltip>
          <Tooltip title="Modified">
            <Chip icon={<UpdateIcon />} label={new Date(domain.modified).toLocaleString()} variant="outlined" size="small" />
          </Tooltip>
          <Tooltip title="Size">
            <Chip icon={<ArchiveIcon />} label={prettyBytes(domain.total_size)} variant="outlined" size="small" />
          </Tooltip>
        </Box>
        <List dense disablePadding subheader={<ListSubheader disableGutters className={classes.groupHeader}><b>Groups</b></ListSubheader>}>
          {domain.groups.map((group: GroupType) => group.type === 'Group'
            ? <GroupInfo group={group} key={group.name} />
            : <DataSetInfo group={group} key={group.name} />)}
        </List>
      </CardContent>
    </Card>
  );
}
