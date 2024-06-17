const path = require("path")
const { promisify } = require("util")

const whisperPath = path.join(__dirname, "../../resources/whisper/addon.node")
const whisperModelFile = path.join(__dirname, "../../resources/whisper/ggml-base.bin")

const { whisper } = require(whisperPath)
const whisperAsync = promisify(whisper)

export { whisper, whisperAsync, whisperModelFile }
