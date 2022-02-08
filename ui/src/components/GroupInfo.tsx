import CodeIcon from "@mui/icons-material/Code";
import ListIcon from "@mui/icons-material/List";
import Chip from "@mui/material/Chip";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { GroupType } from "../Api";

interface Props {
  selected: boolean;
  group: GroupType;
  setSelectedGroup: (group: GroupType) => void;
}

export default function GroupInfo({ selected, group, setSelectedGroup }: Props) {
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
        <CodeIcon />
      </ListItemIcon>
      <ListItemText primary={group.name} secondary={group.type} sx={{ marginTop: 0, marginBottom: 0 }} />
      {group.attributes.length > 0 && (
        <Tooltip title="Other attributes">
          <Chip icon={<ListIcon />} label="Attributes" variant="outlined" size="small" />
        </Tooltip>
      )}
    </>
  );
}
