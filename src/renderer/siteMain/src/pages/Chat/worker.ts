import { AutoTokenizer, AutoModelForCausalLM, TextStreamer, StoppingCriteria, env } from "@huggingface/transformers"

env.remotePathTemplate = "{model}"
env.useBrowserCache = true

class CallbackTextStreamer extends TextStreamer {
  private cb

  constructor(tokenizer, cb) {
    super(tokenizer, {
      skip_prompt: true,
      // skip_special_tokens: true,
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

const stopping_criteria = new InterruptableStoppingCriteria()

/**
 * This class uses the Singleton pattern to ensure that only one instance of the model is loaded.
 */
class TextGenerationPipeline {
  static model_id = null
  static model = null
  static tokenizer = null
  static streamer = null

  static async getInstance(progress_callback = null) {
    // Choose the model based on whether fp16 is available
    // this.model_id = "Phi-3-mini-4k-instruct";
    this.model_id = "Phi-3-mini-4k-instruct"

    this.tokenizer ??= AutoTokenizer.from_pretrained(this.model_id, {
      legacy: true,
      progress_callback,
    })

    this.model ??= AutoModelForCausalLM.from_pretrained(this.model_id, {
      dtype: "q4",
      device: "webgpu",
      use_external_data_format: true,
      progress_callback,
    })

    return Promise.all([this.tokenizer, this.model])
  }
}

async function generate(messages) {
  // Retrieve the text-generation pipeline.
  const [tokenizer, model] = await TextGenerationPipeline.getInstance()
    .then((res) => {
      return res
    })
    .catch((e) => {
      self.postMessage({
        status: "errorMessage",
        message: "模型加载失败，请到设置页面检查模型！",
      })
      return null
    })
  const inputs = tokenizer.apply_chat_template(messages, {
    add_generation_prompt: true,
    return_dict: true,
  })

  let allOutputText = ""

  let startTime
  let numTokens = 0
  const cb = (output) => {
    allOutputText += output
    startTime ??= performance.now()

    let tps
    if (numTokens++ > 0) {
      tps = (numTokens / (performance.now() - startTime)) * 1000
    }
    self.postMessage({
      status: "update",
      output: allOutputText.replace("<|end|>", ""),
      tps,
      numTokens,
    })
  }

  const streamer = new CallbackTextStreamer(tokenizer, cb)

  // Tell the main thread we are starting
  self.postMessage({ status: "start" })

  const outputs = await model.generate({
    ...inputs,
    max_new_tokens: 512,
    streamer,
    stopping_criteria,
  })
  const outputText = tokenizer.batch_decode(outputs, {
    skip_special_tokens: false,
  })

  // Send the output back to the main thread
  self.postMessage({
    status: "complete",
    output: outputText,
  })
}

async function load() {
  self.postMessage({
    status: "loading",
    data: "Loading model...",
  })

  // Load the pipeline and save it for future use.
  const [tokenizer, model] = await TextGenerationPipeline.getInstance((x) => {
    // We also add a progress callback to the pipeline so that we can
    // track model loading.
    console.log(x.name, x.status, x.progress)
    // self.postMessage(x)
  })

  self.postMessage({
    status: "loading",
    data: "Compiling shaders and warming up model...",
  })

  // Run model with dummy input to compile shaders
  const inputs = tokenizer("a")
  await model.generate({ ...inputs, max_new_tokens: 1 })
  self.postMessage({ status: "ready" })
}
// Listen for messages from the main thread
self.addEventListener("message", async (e) => {
  const { type, data } = e.data

  switch (type) {
    case "init":
      env.remoteHost = data.remoteHost
      console.log(env.remoteHost)
      break
    case "load":
      load()
      break

    case "generate":
      stopping_criteria.reset()
      generate(data)
      break

    case "interrupt":
      stopping_criteria.interrupt()
      break

    case "reset":
      stopping_criteria.reset()
      break
  }
})
