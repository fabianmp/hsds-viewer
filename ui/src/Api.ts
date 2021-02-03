export interface Node {
  path: string
  name: string
  type: string
  owner: string
  created: string
  modified: string
  total_size: number
}

export interface Info {
  endpoint: string
  state: string
  node_count: number
  hsds_version: string
}

interface GroupType {
  name: string
  type: string
  size?: number
}

export interface File {
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
