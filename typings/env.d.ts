/// <reference types="vite/client" />

import enUS from '@renderer/i18n/modules/en_US.json'

const resources = { translation: enUS } as const;

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources;
  }
}

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