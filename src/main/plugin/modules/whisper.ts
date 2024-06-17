import { ipcMain, BrowserWindow } from "electron"
import { spawn, ChildProcessWithoutNullStreams } from "child_process"
import { getFfmpegPath, convertTimeToSeconds, getVideoInfo } from "@main/plugin/modules/ffmpeg"
import { checkFolderExists, writeFile } from "@main/utils/fileHelper"
import { queueStoreAdd, queueStoreUpdate } from "@main/utils/storeHelper"
import { whisperAsync, whisperModelFile } from "../../utils/whisperHelper.js"
import { unlinkSync } from "fs"

ipcMain.on("WHISPER_EXTRACT", async (e, params) => {
  // 将音视频转换为wav格式
  const videoInfo = await getVideoInfo(params.inputFilePath)
  const videoDuration = videoInfo.duration ?? 0
  const ffmpegPath = getFfmpegPath()
  checkFolderExists(params.outputFloaderPath)
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
    BrowserWindow.fromWebContents(e.sender)?.webContents.send(`WHISPER_EXTRACT_PROGRESS_${params.taskId}`, newParams)
  }

  const whisperWav = `${params.outputFloaderPath}\\whisper-${params.taskId}.wav`

  const ffmpegProcess: ChildProcessWithoutNullStreams = spawn(ffmpegPath, [
    "-i",
    params.inputFilePath,
    "-vn",
    "-ar",
    "16000",
    "-ac",
    "1",
    whisperWav,
  ])
  ffmpegProcess.stderr.on("data", (data) => {
    const result = data.toString()
    const match = result.match(/time=([0-9:.]+)/)
    if (match && match[1]) {
      const currentTime = convertTimeToSeconds(match[1])
      const progress = ((currentTime / videoDuration) * 70).toFixed(2)
      console.log(`Progress: ${progress}%`)
      sendFunc({
        progress: Number(progress) > 70 ? 70 : Number(progress),
      })
    }
  })
  ffmpegProcess.on("close", async (code) => {
    console.log(`ffmpeg退出，退出码 ${code}`)
    if (code === 0) {
      // 通过whisper提取字幕
      const whisperParams = {
        language: "zh",
        model: whisperModelFile,
        fname_inp: whisperWav,
        use_gpu: true,
        flash_attn: false,
        no_prints: true,
        comma_in_time: false,
        translate: true,
        no_timestamps: false,
        audio_ctx: 0,
        n_threads: 6, // 经过测试，4~6线程为佳
      }
      await whisperAsync(whisperParams).then(async (result) => {
        const contentText = result.map((item) => item[2]).join(",")
        await writeFile(`${params.outputFloaderPath}/${params.outputFileName}`, contentText)
        await unlinkSync(whisperWav)
        sendFunc({
          progress: Number(100),
        })
      })
    }
  })
})
