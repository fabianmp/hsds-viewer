import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import MaterialLink from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import React from "react";
import { Link, useHistory } from 'react-router-dom';
import { useSelectedFolderPath } from "../Hooks";

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

interface Props {
  className?: string
}

export default function FolderCrumbs({ className }: Props) {
  const history = useHistory();
  const classes = useStyles();
  const selectedFolderPath = useSelectedFolderPath();

  const folderNames = selectedFolderPath.replace(/^\/?(.*?)\/?$/, "$1").split("/");
  const breadCrumbs = folderNames.map((name, index) => [name, `/${folderNames.slice(0, index + 1).join("/")}/`]);

  const handleSelect = (nodeId: string) => {
    history.push(nodeId);
  };

  return (<Breadcrumbs className={className}>
    {breadCrumbs.slice(0, -1).map(([name, path]) =>
      <Link to={path} key={path} component={MaterialLink} onClick={() => handleSelect(path)}
        className={classes.crumb}><FolderIcon />{name}</Link>)}
    <Typography className={classes.crumb}><FolderOpenIcon />{breadCrumbs[breadCrumbs.length - 1][0]}</Typography>
  </Breadcrumbs>);
}
