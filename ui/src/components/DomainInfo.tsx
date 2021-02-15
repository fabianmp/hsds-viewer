import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Chip from "@material-ui/core/Chip";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from "@material-ui/core/ListSubheader";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from "@material-ui/core/Tooltip";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ArchiveIcon from '@material-ui/icons/Archive';
import CodeIcon from '@material-ui/icons/Code';
import DescriptionIcon from '@material-ui/icons/Description';
import PersonIcon from '@material-ui/icons/Person';
import UpdateIcon from '@material-ui/icons/Update';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import prettyBytes from 'pretty-bytes';
import React from "react";
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
  }),
);

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
          {domain.groups.map((group: GroupType) =>
            <ListItem disableGutters key={group.name}>
              <ListItemIcon className={classes.groupIcon}>
                <Tooltip title={`${group.chunks} chunks`}>
                  <Badge badgeContent={group.chunks} color="primary">{group.type === 'Group' ? <CodeIcon /> : <DescriptionIcon />}</Badge>
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary={group.name}
                secondary={group.size ? `${group.type} (${prettyBytes(group.size)}, ${group.datatype})` : group.type} className={classes.groupText} />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}
