// 使用esm引用addon.node会报错，此处暂时使用commonjs
const path = require("path")
const { promisify } = require("util")

const whisperPath = path.join(__dirname, "../../resources/whisper/addon.node")

const { whisper } = require(whisperPath)
const whisperAsync = promisify(whisper)

export { whisperAsync }
