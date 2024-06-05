/// <reference types="vite/client" />

interface compressType {
  originFileSize?: null | number
  outputFileSize?: null | number
  code: string
  taskId: string
  inputFilePath: string
  outputFloaderPath: any
  outputFileName: string
  outputType: string | undefined
  createTime: number
  progress: number
  command: string[]
}