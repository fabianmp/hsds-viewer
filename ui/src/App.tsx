import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import HsdsData from "./components/HsdsData";
import NodeInfo from "./components/NodeInfo";
import ServerInfoPage from "./components/ServerInfoPage";
import TitleBar from "./components/TitleBar";

export default function App() {
  return (
    <Router>
      <Box display="flex" sx={{ paddingTop: 10 }}>
        <CssBaseline />
        <TitleBar />
        <Routes>
          <Route path="/info" element={<ServerInfoPage />} />
          <Route path="/nodes" element={<NodeInfo />} />
          <Route path="/*" element={<HsdsData />} />
        </Routes>
      </Box>
    </Router>
  );
}
