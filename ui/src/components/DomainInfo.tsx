import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Chip from "@material-ui/core/Chip";
import Collapse from "@material-ui/core/Collapse";
import { red } from '@material-ui/core/colors';
import IconButton from "@material-ui/core/IconButton";
import List from '@material-ui/core/List';
import ListSubheader from "@material-ui/core/ListSubheader";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ArchiveIcon from '@material-ui/icons/Archive';
import BlockIcon from '@material-ui/icons/Block';
import InfoIcon from '@material-ui/icons/Info';
import PersonIcon from '@material-ui/icons/Person';
import UpdateIcon from '@material-ui/icons/Update';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import prettyBytes from 'pretty-bytes';
import React, { useState } from "react";
import useSWR from 'swr';
import { ACL, Domain, GroupType } from "../Api";
import { AccessControlTable } from "./AccessControl";
import AlignIcon from "./AlignIcon";
import DataSetInfo from "./DataSetInfo";
import GroupInfo from "./GroupInfo";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
    content: {
      paddingTop: 0,
      '& > *': {
        marginTop: theme.spacing(1),
      },
    },
    info: {
      display: 'block',
    },
    metadata: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
    center: {
      textAlign: 'center',
    },
    groupHeader: {
      lineHeight: 2,
    },
  }),
);

interface Props {
  domain: Domain
}

export default function DomainInfo({ domain }: Props) {
  const classes = useStyles();
  const [showMetadata, setShowMetadata] = useState(false);
  const { data: acls = [] } = useSWR<ACL[]>(showMetadata ? `/api/domain${domain.domain}/${domain.filename}/acl` : [])

  return (
    <Card style={{ maxHeight: '90vh', overflow: 'auto' }}>
      <CardHeader title={domain.filename} subheader={`${domain.domain}/`} titleTypographyProps={{ variant: 'body1' }}
        subheaderTypographyProps={{ variant: 'body2' }} className={classes.header}
        action={<Tooltip title="Show metadata">
          <IconButton onClick={() => setShowMetadata((s: boolean) => !s)}><InfoIcon /></IconButton>
        </Tooltip>} />
      <CardContent className={classes.content}>
        <Collapse in={showMetadata}>
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
          <AccessControlTable variant="small" acls={acls} />
        </Collapse>
        <List dense disablePadding subheader={<ListSubheader disableGutters className={classes.groupHeader}><b>Groups</b></ListSubheader>}>
          {domain.groups.map((group: GroupType) => group.type === 'Group'
            ? <GroupInfo group={group} key={group.name} />
            : <DataSetInfo group={group} key={group.name} />)}
        </List>
        {acls.length === 0 && <Box className={classes.center}>
          <AlignIcon>
            <BlockIcon fontSize="large" style={{ color: red[500] }} />
            <Typography variant="h5">Unauthorized</Typography>
          </AlignIcon>
        </Box>}
      </CardContent>
    </Card>
  );
}
