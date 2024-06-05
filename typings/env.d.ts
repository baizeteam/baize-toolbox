/// <reference types="vite/client" />

declare global {
  interface compressType {
    originFileSize?: null | number
    outputFileSize?: null | number
    code: string
    taskId: string
    inputFilePath: string
    outputFloaderPath: string
    outputFileName: string
    outputType: string | undefined
    createTime: number
    progress: number
    command: string[]
  }
}