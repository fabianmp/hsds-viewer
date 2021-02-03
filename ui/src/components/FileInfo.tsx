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
import { File } from "../Api";

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
  file: File
}

export default function FileInfo({ file }: Props) {
  const classes = useStyles();
  return (
    <Card>
      <CardHeader title={file.filename} subheader={`${file.domain}/`}
        subheaderTypographyProps={{ variant: 'body2' }} className={classes.header} />
      <CardContent className={classes.content}>
        <List dense disablePadding subheader={<ListSubheader disableGutters className={classes.groupHeader}><b>Metadata</b></ListSubheader>}>
          <ListItem className={classes.metadata}><ListItemText><b>MD5:</b> {file.md5_sum}</ListItemText></ListItem>
          <ListItem className={classes.metadata}><ListItemText><b>Owner:</b> {file.owner}</ListItemText></ListItem>
          <ListItem className={classes.metadata}><ListItemText><b>Created:</b> {file.created}</ListItemText></ListItem>
          <ListItem className={classes.metadata}><ListItemText><b>Modified:</b> {file.modified}</ListItemText></ListItem>
          <ListItem className={classes.metadata}><ListItemText><b>Size:</b> {prettyBytes(file.total_size)}</ListItemText></ListItem>
          <ListItem className={classes.metadata}><ListItemText><b>Chunks:</b> {file.num_chunks}</ListItemText></ListItem>
          <ListItem className={classes.metadata}><ListItemText><b>Groups:</b> {file.num_groups}</ListItemText></ListItem>
        </List>
        <Divider />
        <List dense disablePadding subheader={<ListSubheader disableGutters className={classes.groupHeader}><b>Groups</b></ListSubheader>}>
          {file.groups.map(group =>
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
