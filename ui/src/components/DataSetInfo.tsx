import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from "@material-ui/core/Tooltip";
import ArchiveIcon from '@material-ui/icons/Archive';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import BorderAllIcon from '@material-ui/icons/BorderAll';
import DescriptionIcon from '@material-ui/icons/Description';
import ListIcon from '@material-ui/icons/List';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import prettyBytes from 'pretty-bytes';
import React from "react";
import { GroupType } from "../Api";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    metadata: {
      display: 'flex',
      justifyContent: 'center',
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
  }),
);

interface Props {
  selected: boolean
  group: GroupType
  setSelectedGroup: (group: GroupType) => void
}

export default function DataSetInfo({ selected, group, setSelectedGroup }: Props) {
  const classes = useStyles();

  const createItem = (children: JSX.Element) => group.attributes.length > 0
    ? <MenuItem selected={selected} disableGutters key={group.name} onClick={() => setSelectedGroup(group)}>{children}</MenuItem>
    : <ListItem selected={selected} disableGutters key={group.name}>{children}</ListItem>;

  return createItem(<>
    <ListItemIcon className={classes.groupIcon}><DescriptionIcon /></ListItemIcon>
    <ListItemText primary={group.name} secondary={group.type} className={classes.groupText} />
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
      {group.attributes.length > 0 && <Tooltip title="Other attributes">
        <Chip icon={<ListIcon />} label="Attributes" variant="outlined" size="small" />
      </Tooltip>}
    </Box>
  </>);
}
