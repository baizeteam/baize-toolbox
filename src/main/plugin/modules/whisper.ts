import { ipcMain, BrowserWindow } from "electron"
import { spawn, ChildProcessWithoutNullStreams } from "child_process"
import { getFfmpegPath } from "@main/plugin/modules/ffmpeg"
import { checkFolderExists, writeFile } from "@main/utils/fileHelper"
import { queueStoreAdd, queueStoreUpdate } from "@main/utils/storeHelper"
import { whisperAsync, whisperModelFile } from "../../utils/whisperHelper.js"
import { unlinkSync } from "fs"

ipcMain.on("WHISPER_EXTRACT", (e, params) => {
  console.log(params)
  // 将音视频转换为wav格式
  const ffmpegPath = getFfmpegPath()
  checkFolderExists(params.outputFloaderPath)
  // queueStoreAdd({
  //   params: { ...params },
  //   key: `${params.code}List`,
  // })

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
  ffmpegProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`)
  })
  ffmpegProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`)
  })
  ffmpegProcess.on("close", async (code) => {
    console.log(`ffmpeg退出，退出码 ${code}`)
    if (code === 0) {
      console.log(process.argv)

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

      console.time("whisper")
      await whisperAsync(whisperParams).then(async (result) => {
        const contentText = result.map((item) => item[2]).join(",")
        await writeFile(`${params.outputFloaderPath}/${params.outputFileName}`, contentText)
        await unlinkSync(whisperWav)
        console.log(result)
      })
      console.timeEnd("whisper")
    }
  })
})
