import { EdgeSpeechTTS } from "@lobehub/tts";
import WebSocket from "ws";
import { ipcMain } from "electron";

global.WebSocket = WebSocket;
const tts = new EdgeSpeechTTS({ locale: "en-ZH" });

ipcMain.handle("TTS_CREATE", async (e, data) => {
  const res = await tts.create(data);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Data = buffer.toString("base64");
  console.log(base64Data);
  return {
    ...data,
    url: base64Data,
    status: "success",
  };
});
