import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import HsdsData from './components/HsdsData';
import NodeInfo from './components/NodeInfo';
import ServerInfoPage from './components/ServerInfoPage';
import TitleBar from './components/TitleBar';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      paddingTop: theme.spacing(10),
    },
  }),
);

export default function App() {
  const classes = useStyles();
  return (
    <Router>
      <Box display="flex" className={classes.content}>
        <CssBaseline />
        <TitleBar />
        <Switch>
          <Route path="/info">
            <ServerInfoPage />
          </Route>
          <Route path="/nodes">
            <NodeInfo />
          </Route>
          <Route path="/:path*">
            <HsdsData />
          </Route>
        </Switch>
      </Box>
    </Router>
  );
}
