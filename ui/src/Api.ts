export interface ServerInfo {
  endpoint: string
  state: string
  node_count: number
  hsds_version: string
}

export interface NodeInfo {
  path: string
  name: string
  type: "folder" | "domain"
  owner: string
  created: string
  modified: string
  total_size: number
}

export interface ACL {
  create: boolean
  delete: boolean
  domain?: string
  read: boolean
  readACL: boolean
  update: boolean
  updateACL: boolean
  userName: string
}

export interface Folder {
  acls: ACL[]
  subfolders: NodeInfo[]
  domains: NodeInfo[]
}

export interface GroupType {
  name: string
  type: string
  size?: number
  dimensions?: number
  chunks?: number
  datatype?: string
}

export interface Domain {
  domain: string
  filename: string
  md5_sum: string
  created: string
  modified: string
  owner: string
  total_size: number
  num_chunks: number
  num_groups: number
  groups: GroupType[]
}
