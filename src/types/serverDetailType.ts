export interface dynamicStatus {
  cpu: number
  mem: number
  disk: number
  upload: number
  download: number
  online: boolean
}

export interface serverSys {
  os: string
  arch: string
}

export interface apiResponse {
  code: number
  data: {
    id: string
    system: serverSys
    status: dynamicStatus
  }
}

export interface serverDataStoreStructure {
  [id: string]: {
    system: serverSys
    status: dynamicStatus
  }
}
