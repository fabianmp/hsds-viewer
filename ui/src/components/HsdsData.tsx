import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { Folder } from "../Api";
import { useSelectedDomainPath, useSelectedFolderPath, useServerInfo } from "../Hooks";
import DeleteDialogs, { DeleteOptions } from "./DeleteDialogs";
import FileContent from "./FileContent";
import FolderContent from "./FolderContent";
import FolderTree from "./FolderTree";

const sx = {
  content: {
    paddingLeft: 2,
    paddingRight: 2,
    width: "100%",
    "& > * + *": {
      marginTop: 1,
    },
  },
  drawerPaper: {
    width: 350,
    overflow: "auto",
    paddingTop: 10,
    paddingLeft: 0,
    paddingRight: 0,
  },
} as const;

const emptyDeleteOptions: DeleteOptions = {
  path: "",
  baseUrl: "",
  handler: () => {},
};

export default function HsdsData() {
  const selectedFolderPath = useSelectedFolderPath();
  const selectedDomainPath = useSelectedDomainPath();
  const { data: rootFolder = undefined } = useSWR<Folder>("/api/folder/");
  const info = useServerInfo();
  const [deleteOptions, setDeleteOptions] = useState<DeleteOptions>(emptyDeleteOptions);

  useEffect(() => {
    mutate(`/api/folder${selectedFolderPath}`);
    mutate(`/api/folder${selectedFolderPath}acl`);
    mutate(`/api/domain${selectedDomainPath}`);
    mutate(`/api/domain${selectedDomainPath}/acl`);
  }, [info.username, selectedFolderPath, selectedDomainPath]);

  return (
    <>
      <Drawer variant="permanent" sx={{ width: 350, [`& .MuiDrawer-paper`]: sx.drawerPaper }} open>
        {rootFolder && <FolderTree folder={rootFolder} />}
      </Drawer>
      <Box sx={sx.content}>
        {selectedDomainPath ? <FileContent setDeleteOptions={setDeleteOptions} /> : <FolderContent setDeleteOptions={setDeleteOptions} />}
      </Box>
      <DeleteDialogs
        deletePath={deleteOptions.path}
        deleteBaseUrl={deleteOptions.baseUrl}
        cancel={() => setDeleteOptions(emptyDeleteOptions)}
        done={deleteOptions.handler}
      />
    </>
  );
}
