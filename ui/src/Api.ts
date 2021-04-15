export interface ServerInfo {
  endpoint: string
  state: string
  node_count: number
  hsds_version: string
  username: string
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
  subfolders: NodeInfo[]
  domains: NodeInfo[]
}

export interface Attribute {
  name: string
  value: string
}

export interface GroupType {
  name: string
  type: string
  attributes: Attribute[]
  size?: number
  shape?: number[]
  chunks?: number
  chunk_shape?: number[]
  datatype_name?: string
  datatype_kind?: string
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
  unauthorized?: boolean
}
