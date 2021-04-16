import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import MaterialLink from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import React from "react";
import { Link, useParams } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    crumb: {
      display: 'inline-flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& > *': {
        marginRight: theme.spacing(1),
      },
    },
  }),
);

interface RouteParams {
  path: string
}

interface Props {
  selectPath: (path: string) => void
}

export default function FolderCrumbs({ selectPath }: Props) {
  const classes = useStyles();
  const { path: folderPath = "" } = useParams<RouteParams>();

  const folderNames = folderPath.split("/");
  const breadCrumbs = folderNames.map((name, index) => [name, `/${folderNames.slice(0, index + 1).join("/")}/`]);

  return (<Breadcrumbs aria-label="breadcrumb">
    {breadCrumbs.slice(0, -1).map(([name, path]) =>
      <Link to={path} key={path} component={MaterialLink} onClick={() => selectPath(path)}
        className={classes.crumb}><FolderIcon />{name}</Link>)}
    <Typography className={classes.crumb}><FolderOpenIcon />{breadCrumbs[breadCrumbs.length - 1][0]}</Typography>
  </Breadcrumbs>);
}
