import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import { useSelectedDomainPath } from "../Hooks";

const sx = {
  crumb: {
    display: "inline-flex",
    alignItems: "center",
    flexWrap: "wrap",
    "& > *": {
      marginRight: 1,
    },
  },
} as const;

export default function FileCrumbs() {
  const navigate = useNavigate();
  const selectedFilePath = useSelectedDomainPath();

  const folderNames = selectedFilePath.replace(/^\/?(.*?)\/?$/, "$1").split("/");
  const breadCrumbs = folderNames.map((name, index) => [name, `/${folderNames.slice(0, index + 1).join("/")}/`]);

  const handleSelect = (nodeId: string) => {
    navigate(nodeId);
  };

  return (
    <Breadcrumbs sx={{ flexGrow: 1 }}>
      {breadCrumbs.slice(0, -1).map(([name, path]) => (
        <Link to={path} key={path} onClick={() => handleSelect(path)} style={sx.crumb}>
          <FolderIcon sx={{ marginRight: 1 }} />
          {name}
        </Link>
      ))}
      <Typography sx={sx.crumb}>
        <DescriptionIcon />
        {breadCrumbs[breadCrumbs.length - 1][0]}
      </Typography>
    </Breadcrumbs>
  );
}
