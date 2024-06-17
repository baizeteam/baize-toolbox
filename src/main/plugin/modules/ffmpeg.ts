import { execFile, spawn } from "child_process"
import { app, ipcMain, BrowserWindow, dialog } from "electron"
import path, { resolve } from "path"
import { checkFolderExists, getFileSize } from "@main/utils/fileHelper"
import { queueStoreAdd, queueStoreUpdate } from "@main/utils/storeHelper"
import { mainWinStartProxy, START_STATUS } from "@main/helper"
import * as ffmpegStatic from "ss-ffmpeg-static-electron"
// import { mainLogSend } from "@main/helper";

interface VideoInfo {
  duration?: number
  bitrate?: number
  codec?: string
  resolution?: {
    width: number
    height: number
  }
  frameRate?: number
}

// 获取 ffmpeg 路径
export const getFfmpegPath = (): string => {
  if (!app.isPackaged) {
    return ffmpegStatic.path
  } else {
    const basePath = path.join(process.resourcesPath, "app.asar.unpacked/node_modules/ss-ffmpeg-static-electron")
    const list = ffmpegStatic.path.split("\\ss-ffmpeg-static-electron")
    const ffmpegPath = list[list.length - 1]
    return path.join(basePath, ffmpegPath)
  }
}

// 将时间字符串转换为秒数
export function convertTimeToSeconds(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(":").map(parseFloat)
  return hours * 3600 + minutes * 60 + seconds
}

// 获取视频信息
export const getVideoInfo = async (filePath): Promise<VideoInfo> => {
  return new Promise((resolve, reject) => {
    const command = ["-i", filePath, "-f", null, "-"]
    const ffmpegPath = getFfmpegPath()
    const ffmpegProcess = spawn(ffmpegPath, command)
    let output = ""

    ffmpegProcess.stderr.on("data", (data) => {
      output += data.toString()
    })

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        const info = parseVideoInfo(output)
        resolve(info)
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`))
      }
    })
  })
}

// 解析 ffmpeg 的输出信息
function parseVideoInfo(info) {
  const lines = info.split("\n")
  const videoInfo: VideoInfo = {}
  lines.forEach((line) => {
    if (line.indexOf("Video") !== -1) {
      console.log(line)
      const bitrateMatch = line.match(/(\d+\.?\d*) kb/)
      const codecMatch = line.match(/Stream.*Video: ([^,]+)/)
      const resolutionMatch = line.match(/(\d{2,4})x(\d{2,4})/)
      const frameRateMatch = line.match(/(\d+\.?\d*) fps/)

      if (bitrateMatch && !videoInfo.bitrate) {
        videoInfo.bitrate = parseInt(bitrateMatch[1])
      }
      if (codecMatch) {
        videoInfo.codec = codecMatch[1].trim()
      }
      if (resolutionMatch) {
        videoInfo.resolution = {
          width: parseInt(resolutionMatch[1]),
          height: parseInt(resolutionMatch[2]),
        }
      }
      if (frameRateMatch && !videoInfo.frameRate) {
        videoInfo.frameRate = parseFloat(frameRateMatch[1])
      }
    }
    const durationMatch = line.match(/Duration: (\d{2}):(\d{2}):(\d{2})/)
    if (durationMatch) {
      videoInfo.duration = convertTimeToSeconds(`${durationMatch[1]}:${durationMatch[2]}:${durationMatch[3]}`)
    }
  })

  return videoInfo
}

app.on("ready", () => {
  const ffmpegPath = getFfmpegPath()
  // 检查 ffmpeg 是否存在
  execFile(ffmpegPath, ["-version"], (error, stdout, stderr) => {
    if (error) {
      return
    } else {
      mainWinStartProxy.ffmpeg = START_STATUS.success
    }
    console.log(`ffmpeg 版本信息：\n${stdout}`)
  })

  // 执行ffmpeg 命令
  ipcMain.on("FFMPEG_COMMAND", async (e, params) => {
    console.log("FFMPEG_COMMAND", params)
    const videoInfo = await getVideoInfo(params.inputFilePath)
    const videoDuration = videoInfo.duration ?? 0
    checkFolderExists(params.outputFloaderPath)
    const outputFilePath = path.join(params.outputFloaderPath, params.outputFileName)
    const command = [...params.command, outputFilePath]
    const ffmpegProcess = spawn(ffmpegPath, command)
    const taskId = params.taskId
    queueStoreAdd({
      params: { ...params, progress: 0 },
      key: `${params.code}List`,
    })
    const sendFunc = (data) => {
      const newParams = { ...params, ...data }
      queueStoreUpdate({
        params: newParams,
        key: `${params.code}List`,
        idKey: "taskId",
      })
      BrowserWindow.fromWebContents(e.sender)?.webContents.send(`FFMPEG_PROGRESS_${taskId}`, newParams)
    }

    ffmpegProcess.stderr.on("data", (data) => {
      const result = data.toString()
      const match = result.match(/time=([0-9:.]+)/)
      if (match && match[1]) {
        const currentTime = convertTimeToSeconds(match[1])
        const progress = ((currentTime / videoDuration) * 100).toFixed(2)
        console.log(`Progress: ${progress}%`)
        sendFunc({
          progress: Number(progress),
        })
      }
    })

    ffmpegProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`FFmpeg 进程关闭，但出现错误，退出码 ${code}`)
        sendFunc({
          error: code,
        })
      } else {
        console.log("FFmpeg 进程正常关闭")
        const outputFileSize = getFileSize(outputFilePath)
        sendFunc({
          outputFileSize,
          progress: 100,
        })
      }
    })
  })

  ipcMain.handle("FFMPEG_GET_VIDEO_INFO", async (e, params) => {
    return await getVideoInfo(params.filePath)
  })
})
