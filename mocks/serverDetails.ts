import { MockMethod } from "vite-plugin-mock"
import Mock from "mockjs"
import type { serverList } from "@/types/serverListType.ts"
import type {
  apiResponse,
  dynamicStatus,
  serverSys,
} from "@/types/serverDetailType.ts"

// Type
interface serverListReturn {
  code: number
  data: serverList
}

const systemData: Record<string, { os: string; arch: string }> = {}

// 随机生成系统信息
function generateSystem(id: string): serverSys {
  if (!systemData[id]) {
    systemData[id] = {
      os: Mock.Random.pick(["win", "linux", "mac"]),
      arch: Mock.Random.pick(["x86", "arm", "risc-v"]),
    }
  }
  return systemData[id]
}

// 每次请求生成动态状态数据
function generateDynamic(): dynamicStatus {
  let onlineState = Mock.Random.boolean()
  if (onlineState) {
    return {
      cpu: Mock.Random.float(10, 100, 2, 2),
      mem: Mock.Random.float(10, 100, 2, 2),
      disk: Mock.Random.float(10, 100, 2, 2),
      upload: Mock.Random.float(0, 99999, 2, 2), // in Kbps
      download: Mock.Random.float(0, 99999, 2, 2), // in Kbps
      online: onlineState,
    }
  } else {
    return {
      cpu: 0,
      mem: 0,
      disk: 0,
      upload: 0,
      download: 0,
      online: onlineState,
    }
  }
}

export default [
  {
    url: "/api/server/detail",
    method: "get",
    response: ({ query }: { query: { id: string } }): apiResponse => {
      const { id } = query
      const sys = generateSystem(id)
      const dynamic = generateDynamic()
      return {
        code: 200,
        data: {
          id,
          system: sys,
          status: dynamic,
        },
      }
    },
  },
  {
    url: "/api/server/list",
    method: "get",
    response: (): serverListReturn => {
      const list = []
      // Generate 10 mock server items
      for (let i = 0; i < 12; i++) {
        const id = Mock.Random.id() // Generate a unique ID for each server
        const sys = generateSystem(id)
        // const dynamic = generateDynamic()
        list.push({
          id,
        })
      }

      return {
        code: 200,
        data: {
          total: list.length,
          list: list,
        },
      }
    },
  },
] satisfies MockMethod[]
