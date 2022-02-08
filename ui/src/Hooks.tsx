import { useLocation } from "react-router-dom";
import useSWR from "swr";
import { Domain, Folder, ServerInfo } from "./Api";

export function useSelectedFolderPath() {
  const { pathname } = useLocation();
  return pathname.endsWith("/") ? pathname : pathname.split("/").slice(0, -1).concat("").join("/");
}

export function useSelectedDomainPath() {
  const { pathname } = useLocation();
  return pathname.endsWith("/") ? "" : pathname;
}

export function useServerInfo() {
  const {
    data: info = {
      version: "<unknown>",
      endpoint: "",
      state: "LOADING",
      node_count: 0,
      hsds_version: "?",
      username: "<unknown>",
    },
  } = useSWR<ServerInfo>("/api/info");

  return info;
}

export function useFolder(path?: string) {
  const { data: folder = null, error } = useSWR<Folder>(path !== "/" ? `/api/folder${path}/` : null);
  return {
    folder,
    isLoading: !folder && !error,
  };
}

export function useDomain(path?: string) {
  const { data: domain = null, error } = useSWR<Domain>(path ? `/api/domain${path}` : null);
  return {
    domain,
    isLoading: !domain && !error,
  };
}
