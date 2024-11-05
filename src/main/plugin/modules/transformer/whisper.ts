import {
  AutoTokenizer,
  AutoProcessor,
  WhisperForConditionalGeneration,
  TextStreamer,
  full,
  env,
} from "@huggingface/transformers"
import { app, ipcMain, BrowserWindow } from "electron"

const MAX_NEW_TOKENS = 64

class AutomaticSpeechRecognitionPipeline {
  static model_id = null
  static tokenizer = null
  static processor = null
  static model = null
  static async getInstance(progress_callback = null) {
    this.model_id = "whisper-base"

    this.tokenizer ??= AutoTokenizer.from_pretrained(this.model_id, {
      progress_callback,
    })
    this.processor ??= AutoProcessor.from_pretrained(this.model_id, {
      progress_callback,
    })
    this.model ??= WhisperForConditionalGeneration.from_pretrained(this.model_id, {
      dtype: {
        encoder_model: "fp32", // 'fp16' works too
        decoder_model_merged: "q4", // or 'fp32' ('fp16' is broken)
      },
      // device: "webgpu",
      progress_callback,
    })

    return Promise.all([this.tokenizer, this.processor, this.model])
  }
}

let processing = false
async function generate({ audio, language }) {
  if (processing) return
  processing = true
  const [tokenizer, processor, model] = await AutomaticSpeechRecognitionPipeline.getInstance()

  let startTime
  let numTokens = 0
  const callback_function = (output) => {
    startTime ??= performance.now()
    let tps
    if (numTokens++ > 0) {
      tps = (numTokens / (performance.now() - startTime)) * 1000
    }
    console.log({
      status: "update",
      output,
      tps,
      numTokens,
    })
  }

  const streamer = new TextStreamer(tokenizer, {
    skip_prompt: true,
    // skip_special_tokens: true,
    callback_function,
  })

  const inputs = await processor(audio)
  const outputs = await model.generate({
    ...inputs,
    max_new_tokens: MAX_NEW_TOKENS,
    language,
    streamer,
  })
  const outputText = tokenizer.batch_decode(outputs, { skip_special_tokens: true })

  console.log("outputText", outputText)
  processing = false
}

async function load() {
  console.log("load")

  // Load the pipeline and save it for future use.
  const [tokenizer, processor, model] = await AutomaticSpeechRecognitionPipeline.getInstance((x) => {
    console.log(x)
  })
  // Run model with dummy input to compile shaders
  await model.generate({
    input_features: full([1, 80, 3000], 0.0),
    max_new_tokens: 1,
  })
  console.log("ready")
}

app.on("ready", async () => {
  console.log("whisper ready")
  ipcMain.on("WHISPER_LOAD", (_, key) => {
    load()
  })
  ipcMain.on("WHISPER_GENERATE", (_, data) => {
    console.log("generate", data)
    generate(data.messages)
  })
})
