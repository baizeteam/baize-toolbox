import * as TTSApi from "@lobehub/tts";
console.log(TTSApi);

// worker.ts
self.onmessage = async function (event: MessageEvent) {
  console.log(event);
  if (event.type === "TTS_CREATE") {
    const params = event.data;
    const tts = new TTSApi.EdgeSpeechTTS({ locale: "zh-CN" });
    const res = await tts.create(params);
    self.postMessage(res);
  }
};
