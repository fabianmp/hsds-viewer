import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from "@material-ui/core/ListSubheader";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ArchiveIcon from '@material-ui/icons/Archive';
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
      paddingTop: 0,
      paddingBottom: 0,
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
    }
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
        <List dense disablePadding subheader={<ListSubheader disableGutters className={classes.groupHeader}><b>Metadata</b></ListSubheader>}>
          <ListItem className={classes.metadata}><ListItemText><b>MD5:</b> {domain.md5_sum}</ListItemText></ListItem>
          <ListItem className={classes.metadata}><ListItemText><b>Owner:</b> {domain.owner}</ListItemText></ListItem>
          <ListItem className={classes.metadata}><ListItemText><b>Created:</b> {domain.created}</ListItemText></ListItem>
          <ListItem className={classes.metadata}><ListItemText><b>Modified:</b> {domain.modified}</ListItemText></ListItem>
          <ListItem className={classes.metadata}><ListItemText><b>Size:</b> {prettyBytes(domain.total_size)}</ListItemText></ListItem>
          <ListItem className={classes.metadata}><ListItemText><b>Chunks:</b> {domain.num_chunks}</ListItemText></ListItem>
          <ListItem className={classes.metadata}><ListItemText><b>Groups:</b> {domain.num_groups}</ListItemText></ListItem>
        </List>
        <Divider />
        <List dense disablePadding subheader={<ListSubheader disableGutters className={classes.groupHeader}><b>Groups</b></ListSubheader>}>
          {domain.groups.map((group: GroupType) =>
            <ListItem disableGutters>
              <ListItemIcon className={classes.groupIcon}><ArchiveIcon /></ListItemIcon>
              <ListItemText primary={group.name}
                secondary={group.size ? `${group.type} (${prettyBytes(group.size)})` : group.type} className={classes.groupText} />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}
