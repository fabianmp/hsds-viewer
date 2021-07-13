import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from '@material-ui/core/CardHeader';
import Chip from "@material-ui/core/Chip";
import { red } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuList from '@material-ui/core/MenuList';
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from "@material-ui/core/Tooltip";
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ArchiveIcon from '@material-ui/icons/Archive';
import BlockIcon from '@material-ui/icons/Block';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';
import UpdateIcon from '@material-ui/icons/Update';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import prettyBytes from "pretty-bytes";
import React from "react";
import { useHistory } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import { ACL, GroupType } from "../Api";
import { useDomain, useSelectedDomainPath } from '../Hooks';
import AccessControl from "./AccessControl";
import AlignIcon from './AlignIcon';
import Attributes from './Attributes';
import DataSetInfo from "./DataSetInfo";
import { DeleteOptions } from './DeleteDialogs';
import FileCrumbs from './FileCrumbs';
import GroupInfo from "./GroupInfo";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actions: {
      flexShrink: 1,
      textAlign: "right",
    },
    deleteButton: {
      padding: 0,
    },
    crumbContainer: {
      display: 'flex',
    },
    crumbs: {
      flexGrow: 1
    },
    loading: {
      padding: theme.spacing(3),
    },
    progress: {
      marginTop: theme.spacing(2),
    },
    unauthorized: {
      padding: theme.spacing(3),
      textAlign: 'center',
    },
    header: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
    metadata: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
    acl: {
      '& > *': {
        marginTop: theme.spacing(1),
      },
    },
    content: {
      paddingTop: 0,
      '& > *': {
        marginTop: theme.spacing(1),
      },
    },
    groupHeader: {
      lineHeight: 2,
    },
  }),
);


interface Props {
  setDeleteOptions: (options: DeleteOptions) => void
}

export default function FileContent({ setDeleteOptions }: Props) {
  const classes = useStyles();
  const history = useHistory();
  const selectedDomainPath = useSelectedDomainPath();
  const { domain: selectedDomain, isLoading } = useDomain(selectedDomainPath);
  const { data: acls = [] } = useSWR<ACL[]>(selectedDomainPath ? `/api/domain${selectedDomainPath}/acl` : [])
  const [selectedGroup, setSelectedGroup] = React.useState<GroupType>();

  if (isLoading) {
    return (<>
      <div className={classes.crumbContainer}>
        <FileCrumbs className={classes.crumbs} />
      </div>
      <Paper className={classes.loading}>
        Loading contents of <strong>{selectedDomainPath}</strong>...
        <LinearProgress className={classes.progress} />
      </Paper>
    </>);
  }

  const domain = selectedDomain!;

  if (!selectedDomain || domain.unauthorized) {
    return (<>
      <div className={classes.crumbContainer}>
        <FileCrumbs className={classes.crumbs} />
      </div>
      <Paper className={classes.unauthorized}>
        <AlignIcon>
          <BlockIcon fontSize="large" style={{ color: red[500] }} />
          <Typography variant="h5">Unauthorized</Typography>
        </AlignIcon>
      </Paper>
    </>);
  }

  const handleDeleteDomainDone = () => {
    const folderPath = selectedDomainPath.split('/').slice(0, -1).concat('').join('/');
    mutate(`/api/folder${folderPath}`);
    history.push(folderPath);
    setDeleteOptions({
      path: "",
      baseUrl: "",
      handler: () => { }
    });
  };

  const handleDeleteDomain = () => {
    setDeleteOptions({
      path: selectedDomainPath,
      baseUrl: "/api/domain",
      handler: handleDeleteDomainDone
    })
  }

  return (<>
    <div className={classes.crumbContainer}>
      <FileCrumbs className={classes.crumbs} />
      <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={handleDeleteDomain}>Delete File</Button>
    </div>
    <Grid container spacing={1}>
      <Grid item xs={selectedGroup ? 6 : 12} className={classes.content}>
        {acls.length > 0 && <AccessControl acls={acls} variant="wide" />}
        <Card style={{ maxHeight: '90vh', overflow: 'auto' }}>
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
            <MenuList dense disablePadding subheader={<ListSubheader disableGutters className={classes.groupHeader}><b>Groups</b></ListSubheader>}>
              {domain.groups.map((group: GroupType) => group.type === 'Group'
                ? <GroupInfo selected={selectedGroup?.name === group.name} group={group} key={group.name} setSelectedGroup={setSelectedGroup} />
                : <DataSetInfo selected={selectedGroup?.name === group.name} group={group} key={group.name} setSelectedGroup={setSelectedGroup} />)}
            </MenuList>
          </CardContent>
        </Card>
      </Grid>
      {selectedGroup && <Grid item xs={6} className={classes.content}>
        <Card>
          <CardHeader title={selectedGroup.name} titleTypographyProps={{ variant: 'subtitle1' }} className={classes.header}
            action={<IconButton onClick={() => setSelectedGroup(undefined)}><CloseIcon /></IconButton>
            } />
          <CardContent>
            <Attributes attributes={selectedGroup.attributes} />
          </CardContent>
        </Card>
      </Grid>}
    </Grid>
  </>);
}
