import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import HomeIcon from '@material-ui/icons/Home';
import PageviewIcon from '@material-ui/icons/Pageview';
import React from "react";
import { ServerInfo } from '../Api';
import AlignIcon from "./AlignIcon";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }),
);

interface Props {
  info: ServerInfo
}

export default function ServerInfoPage({ info }: Props) {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
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
          <Typography variant="body2">
            <AlignIcon><PageviewIcon />HSDS Viewer {info.version}</AlignIcon>
          </Typography>
          <Typography variant="body2">
            <AlignIcon><HomeIcon />{info.endpoint}</AlignIcon>
          </Typography>
          <Typography variant="body2">
            <AlignIcon><AccessTimeIcon />Started at {new Date(info.start_time! * 1000).toLocaleString()}</AlignIcon>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
