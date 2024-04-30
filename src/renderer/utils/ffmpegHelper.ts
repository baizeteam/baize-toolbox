import { separator } from "@renderer/utils/fileHelper"
import { nanoid } from "nanoid"

// 不同平台的 ffmpeg 采集类型
export const COLLECT_TYPE = {
  win32: "gdigrab",
  darwin: "avfoundation",
  linux: "x11grab",
}

// ffmpeg 命令对象转数组
export const ffmpegObj2List = (ffmpegObj) => {
  const list = []
  for (const key in ffmpegObj) {
    list.push(key)
    if (ffmpegObj[key]) {
      list.push(ffmpegObj[key])
    }
  }
  return list
}

// 获取任务基本信息
export const getTaskBaseInfo = async ({
  filePath,
  outputType,
  subFloder,
}: {
  filePath: string
  outputType?: string
  subFloder?: string
}) => {
  const oldFileName = filePath.split(separator).pop().split(".").shift()
  const fileOutputType = outputType || filePath.split("/").pop().split(".").pop()
  const outputFileName = `${oldFileName}-${new Date().getTime()}.${fileOutputType}`
  const outputFloaderPath = await window.ipcInvoke("GET_STORE", "defaultOutPath")
  const taskId = nanoid(16)
  return {
    taskId,
    inputFilePath: filePath,
    outputFloaderPath: subFloder ? `${outputFloaderPath}${separator}${subFloder}` : outputFloaderPath,
    outputFileName,
    outputType: fileOutputType,
    createTime: new Date().getTime(),
    progress: 0,
  }
}
