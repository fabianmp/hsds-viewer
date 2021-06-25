import useSWR from "swr";
import { ServerInfo } from "./Api";

export function useServerInfo() {
    const { data: info = {
        version: "<unknown>",
        endpoint: "",
        state: "LOADING",
        node_count: 0,
        hsds_version: "?",
        username: "<unknown>"
    } } = useSWR<ServerInfo>("/api/info");

    return info;
}
