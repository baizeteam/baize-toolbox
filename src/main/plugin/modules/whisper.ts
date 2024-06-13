import { ipcMain } from "electron"
import { execFile, spawn } from "child_process"

const filePath = "D:\\workplace\\baize-toolbox\\resources\\win\\xiaoyu_output.wav"

const whisperFile = "D:\\workplace\\baize-toolbox\\resources\\whisper\\main.exe"
const tinyModelFile = "D:\\workplace\\baize-toolbox\\resources\\whisper\\models\\ggml-base.bin"

// ipcMain.on("WIN_WHISPER", async () => {
//   spawn(whisperFile, [filePath, tinyModelFile], { shell: true })
// })
const args = ["-m", tinyModelFile, "-f", filePath, "--language", "zh", "-t", "16"]
const process = spawn(whisperFile, args)
// 监听子进程的标准输出
process.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`)
})

// 监听子进程的标准错误输出
process.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`)
})

// 监听子进程的退出事件
process.on("close", (code) => {
  console.log(`子进程退出，退出码 ${code}`)
})
