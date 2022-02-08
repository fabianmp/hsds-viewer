import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArchiveIcon from "@mui/icons-material/Archive";
import BlockIcon from "@mui/icons-material/Block";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import UpdateIcon from "@mui/icons-material/Update";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import { red } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import ListSubheader from "@mui/material/ListSubheader";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { ACL, GroupType } from "../Api";
import { useDomain, useSelectedDomainPath } from "../Hooks";
import AccessControl from "./AccessControl";
import AlignIcon from "./AlignIcon";
import Attributes from "./Attributes";
import DataSetInfo from "./DataSetInfo";
import { DeleteOptions } from "./DeleteDialogs";
import FileCrumbs from "./FileCrumbs";
import GroupInfo from "./GroupInfo";

const sx = {
  unauthorized: {
    padding: 3,
    textAlign: "center",
  },
  header: {
    paddingTop: 2,
    paddingBottom: 1,
  },
  metadata: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: 0.5,
    },
  },
  content: {
    paddingTop: 0,
    "& > *": {
      marginTop: 1,
    },
  },
} as const;

interface Props {
  setDeleteOptions: (options: DeleteOptions) => void;
}

export default function FileContent({ setDeleteOptions }: Props) {
  const navigate = useNavigate();
  const selectedDomainPath = useSelectedDomainPath();
  const { domain: selectedDomain, isLoading } = useDomain(selectedDomainPath);
  const { data: acls = [] } = useSWR<ACL[]>(selectedDomainPath ? `/api/domain${selectedDomainPath}/acl` : []);
  const [selectedGroup, setSelectedGroup] = useState<GroupType>();

  if (isLoading) {
    return (
      <>
        <Box sx={{ display: "flex" }}>
          <FileCrumbs />
        </Box>
        <Paper sx={{ padding: 3 }}>
          Loading contents of <strong>{selectedDomainPath}</strong>...
          <LinearProgress sx={{ marginTop: 2 }} />
        </Paper>
      </>
    );
  }

  const domain = selectedDomain!;

  if (!selectedDomain || domain.unauthorized) {
    return (
      <>
        <Box sx={{ display: "flex" }}>
          <FileCrumbs />
        </Box>
        <Paper sx={sx.unauthorized}>
          <AlignIcon>
            <BlockIcon fontSize="large" style={{ color: red[500] }} />
            <Typography variant="h5">Unauthorized</Typography>
          </AlignIcon>
        </Paper>
      </>
    );
  }

  const handleDeleteDomainDone = () => {
    const folderPath = selectedDomainPath.split("/").slice(0, -1).concat("").join("/");
    mutate(`/api/folder${folderPath}`);
    navigate(folderPath);
    setDeleteOptions({
      path: "",
      baseUrl: "",
      handler: () => {},
    });
  };

  const handleDeleteDomain = () => {
    setDeleteOptions({
      path: selectedDomainPath,
      baseUrl: "/api/domain",
      handler: handleDeleteDomainDone,
    });
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <FileCrumbs />
        <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteDomain}>
          Delete File
        </Button>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={selectedGroup ? 6 : 12} sx={sx.content}>
          {acls.length > 0 && <AccessControl acls={acls} variant="wide" />}
          <Card style={{ maxHeight: "90vh", overflow: "auto" }}>
            <CardContent sx={sx.content}>
              <Box sx={sx.metadata}>
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
              <MenuList
                dense
                disablePadding
                subheader={
                  <ListSubheader disableGutters sx={{ lineHeight: 2 }}>
                    <b>Groups</b>
                  </ListSubheader>
                }
              >
                {domain.groups.map((group: GroupType) =>
                  group.type === "Group" ? (
                    <GroupInfo
                      selected={selectedGroup?.name === group.name}
                      group={group}
                      key={group.name}
                      setSelectedGroup={setSelectedGroup}
                    />
                  ) : (
                    <DataSetInfo
                      selected={selectedGroup?.name === group.name}
                      group={group}
                      key={group.name}
                      setSelectedGroup={setSelectedGroup}
                    />
                  )
                )}
              </MenuList>
            </CardContent>
          </Card>
        </Grid>
        {selectedGroup && (
          <Grid item xs={6} sx={sx.content}>
            <Card>
              <CardHeader
                title={selectedGroup.name}
                titleTypographyProps={{ variant: "subtitle1" }}
                sx={sx.header}
                action={
                  <IconButton onClick={() => setSelectedGroup(undefined)}>
                    <CloseIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Attributes attributes={selectedGroup.attributes} />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </>
  );
}
