import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HomeIcon from "@mui/icons-material/Home";
import PageviewIcon from "@mui/icons-material/Pageview";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useServerInfo } from "../Hooks";
import AlignIcon from "./AlignIcon";

export default function ServerInfoPage() {
  const info = useServerInfo();

  return (
    <Container sx={{ "& > * + *": { marginTop: 2 } }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            {info.name}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            {info.about}
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body1">{info.greeting}</Typography>
        </CardContent>
        <CardContent>
          <AlignIcon sx={{ display: "flex" }}>
            <PageviewIcon />
            <Typography variant="body2">HSDS Viewer {info.version}</Typography>
          </AlignIcon>
          <AlignIcon sx={{ display: "flex" }}>
            <HomeIcon />
            <Typography variant="body2">{info.endpoint}</Typography>
          </AlignIcon>
          <AlignIcon sx={{ display: "flex" }}>
            <AccessTimeIcon />
            <Typography variant="body2">Started at {new Date(info.start_time! * 1000).toLocaleString()}</Typography>
          </AlignIcon>
        </CardContent>
      </Card>
    </Container>
  );
}
