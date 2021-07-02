
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import RefreshIcon from '@material-ui/icons/Refresh';
import TreeView from "@material-ui/lab/TreeView";
import React, { ChangeEvent, useState } from "react";
import { useHistory } from 'react-router-dom';
import { mutate } from 'swr';
import { Folder, NodeInfo } from '../Api';
import { useSelectedFolderPath } from '../Hooks';
import TreeFolder from "./TreeFolder";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerHeading: {
      display: "flex",
      alignItems: "center"
    },
    drawerHeadingTitle: {
      paddingLeft: theme.spacing(2),
      flexGrow: 1
    },
  }),
);

interface Props {
  folder: Folder,
}

export default function FolderTree({ folder }: Props) {
  const classes = useStyles();
  const history = useHistory();
  const selectedFolderPath = useSelectedFolderPath();

  const [expanded, setExpanded] = useState<string[]>([]);

  const expandNode = (nodeId: string) => {
    if (!expanded.includes(nodeId)) {
      setExpanded(expanded.concat([nodeId]))
    }
  }

  if (selectedFolderPath !== "/" && expanded.length === 0) {
    let expandNodes: string[] = []
    const folders = selectedFolderPath.split('/');
    for (let i = 2; i < folders.length; ++i) {
      expandNodes.splice(expandNodes.length, 0, `${folders.slice(0, i).join('/')}/`);
    }
    setExpanded(expandNodes);
  }

  const handleSelect = (event: ChangeEvent<{}>, nodeId: string) => {
    history.push(nodeId);
  };

  const reloadFolders = () => {
    mutate(`/api/folder/`);
    expanded.forEach(x => {
      mutate(`/api/folder${x}`);
      mutate(`/api/folder${x}acl`);
    })
  }

  return (<>
    <Box className={classes.drawerHeading}>
      <Typography variant="h6" className={classes.drawerHeadingTitle}>Folders</Typography>
      <IconButton onClick={reloadFolders}><RefreshIcon fontSize="small" /></IconButton>
    </Box>
    <TreeView
      expanded={expanded}
      selected={selectedFolderPath}
      onNodeSelect={handleSelect}
      defaultCollapseIcon={<FolderOpenIcon />}
      defaultExpandIcon={<FolderIcon />}
      defaultEndIcon={<FolderIcon />}>
      {folder?.subfolders.map((folder: NodeInfo) => <TreeFolder key={folder.path} node={folder}
        expandedNodes={expanded} expandNode={expandNode} />)}
    </TreeView>
  </>);
}
