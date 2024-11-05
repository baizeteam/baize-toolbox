import { AutoTokenizer, AutoModelForCausalLM, TextStreamer, StoppingCriteria, env } from "@huggingface/transformers"
import { app, ipcMain, BrowserWindow } from "electron"
import { join } from "path"

// env.remoteHost = "http://localhost:3000/file"
// env.remotePathTemplate = "{model}"
// env.useBrowserCache = true
env.allowRemoteModels = false
env.useFSCache = true
env.allowLocalModels = true
env.localModelPath = join(__dirname, "../../resources/models")

class CallbackTextStreamer extends TextStreamer {
  private cb

  constructor(tokenizer, cb) {
    super(tokenizer, {
      skip_prompt: true,
    })
    this.cb = cb
  }

  on_finalized_text(text) {
    this.cb(text)
  }
}

class InterruptableStoppingCriteria extends StoppingCriteria {
  private interrupted
  constructor() {
    super()
    this.interrupted = false
  }

  interrupt() {
    this.interrupted = true
  }

  reset() {
    this.interrupted = false
  }

  _call(input_ids, scores) {
    return new Array(input_ids.length).fill(this.interrupted)
  }
}

class TextGenerationPipeline {
  static model_id = null
  static model = null
  static tokenizer = null
  static streamer = null

  static async getInstance(progress_callback = null) {
    // Choose the model based on whether fp16 is available
    this.model_id = "Phi-3-mini-4k-instruct"

    this.tokenizer ??= AutoTokenizer.from_pretrained(this.model_id, {
      legacy: true,
      progress_callback,
    })

    this.model ??= AutoModelForCausalLM.from_pretrained(this.model_id, {
      local_files_only: true,
      dtype: "q4",
      device: "cpu",
      use_external_data_format: false,
      progress_callback,
    })

    return Promise.all([this.tokenizer, this.model])
  }
}

async function generate(messages) {
  const [tokenizer, model] = await TextGenerationPipeline.getInstance()
  const inputs = tokenizer.apply_chat_template(messages, {
    add_generation_prompt: true,
    return_dict: true,
  })

  let allOutputText = ""
  const cb = (output) => {
    allOutputText += output
    console.log({
      status: "update",
      output: allOutputText,
    })
  }

  const streamer = new CallbackTextStreamer(tokenizer, cb)

  const outputs = await model.generate({
    ...inputs,
    max_new_tokens: 512,
    streamer,
    StoppingCriteria,
  })
  const outputText = tokenizer.batch_decode(outputs, {
    skip_special_tokens: false,
  })
  console.log(outputText)
}

async function load() {
  console.log("load")
  const [tokenizer, model] = await TextGenerationPipeline.getInstance((x) => {
    console.log("progress", x)
  })

  // Run model with dummy input to compile shaders
  const inputs = tokenizer("who are you")
  await model.generate({ ...inputs, max_new_tokens: 1 })
}

app.on("ready", async () => {
  console.log("chat ready")
  const stopping_criteria = new InterruptableStoppingCriteria()
  ipcMain.on("CHAT_LOAD", (_, key) => {
    load()
  })
  ipcMain.on("CHAT_GENERATE", (_, data) => {
    console.log("generate", data)
    generate(data.messages)
  })
  ipcMain.on("CHAT_INTERRUPT", (_, data) => {
    stopping_criteria.interrupt()
  })
  ipcMain.on("CHAT_RESET", (_, data) => {
    stopping_criteria.reset()
  })
})
