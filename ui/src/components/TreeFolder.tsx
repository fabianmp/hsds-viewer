import TreeItem from "@mui/lab/TreeItem";
import useSWR from "swr";
import { Folder as ApiFolder, NodeInfo } from "../Api";
import { useSelectedFolderPath } from "../Hooks";

interface Props {
  node: NodeInfo;
  expandedNodes: string[];
  expandNode: (nodeId: string) => void;
}

export default function TreeFolder({ node, expandedNodes, expandNode }: Props) {
  const selectedNode = useSelectedFolderPath();
  const isSelected = selectedNode === node.path;
  const isExpanded = expandedNodes.includes(node.path);
  const { data: folder = null } = useSWR<ApiFolder>(isSelected || isExpanded ? `/api/folder${node.path}` : null);

  if (isSelected && folder && folder.subfolders.length > 0) {
    expandNode(node.path);
  }

  return (
    <TreeItem nodeId={node.path} label={node.name} sx={{ paddingLeft: 2, paddingRight: 2 }}>
      {folder?.subfolders.map((folder: NodeInfo) => (
        <TreeFolder key={folder.path} node={folder} expandedNodes={expandedNodes} expandNode={expandNode} />
      ))}
    </TreeItem>
  );
}
