import ArchiveIcon from "@mui/icons-material/Archive";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import DescriptionIcon from "@mui/icons-material/Description";
import ListIcon from "@mui/icons-material/List";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import prettyBytes from "pretty-bytes";
import { GroupType } from "../Api";

const sx = {
  metadata: {
    display: "flex",
    justifyContent: "center",
    "& > *": {
      margin: 0.5,
    },
  },
} as const;

interface Props {
  selected: boolean;
  group: GroupType;
  setSelectedGroup: (group: GroupType) => void;
}

export default function DataSetInfo({ selected, group, setSelectedGroup }: Props) {
  const createItem = (children: JSX.Element) =>
    group.attributes.length > 0 ? (
      <MenuItem selected={selected} disableGutters key={group.name} onClick={() => setSelectedGroup(group)}>
        {children}
      </MenuItem>
    ) : (
      <ListItem selected={selected} disableGutters key={group.name}>
        {children}
      </ListItem>
    );

  return createItem(
    <>
      <ListItemIcon sx={{ minWidth: 5 }}>
        <DescriptionIcon />
      </ListItemIcon>
      <ListItemText primary={group.name} secondary={group.type} sx={{ marginTop: 0, marginBottom: 0 }} />
      <Box sx={sx.metadata}>
        <Tooltip title="Size">
          <Chip icon={<ArchiveIcon />} label={prettyBytes(group.size!)} variant="outlined" size="small" />
        </Tooltip>
        {!"SO".includes(group.datatype_kind!) && group.shape && (
          <Tooltip title="Dimensions">
            <Chip icon={<AspectRatioIcon />} label={group.shape?.join("x")} variant="outlined" size="small" />
          </Tooltip>
        )}
        {!"SO".includes(group.datatype_kind!) && group.chunks && (
          <Tooltip title="Chunks">
            <Badge badgeContent={group.chunks} color="primary">
              <Chip icon={<BorderAllIcon />} label={group.chunk_shape?.join("x")} variant="outlined" size="small" />
            </Badge>
          </Tooltip>
        )}
        <Tooltip title="Data Type">
          <Chip
            icon={<SettingsEthernetIcon />}
            label={group.datatype_kind === "S" ? "String" : group.datatype_name}
            variant="outlined"
            size="small"
          />
        </Tooltip>
        {group.attributes.length > 0 && (
          <Tooltip title="Other attributes">
            <Chip icon={<ListIcon />} label="Attributes" variant="outlined" size="small" />
          </Tooltip>
        )}
      </Box>
    </>
  );
}
