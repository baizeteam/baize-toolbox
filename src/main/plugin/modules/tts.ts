import { EdgeSpeechTTS } from "@lobehub/tts";
import WebSocket from "ws";
import { ipcMain } from "electron";
import { store } from "./store";

global.WebSocket = WebSocket;
const tts = new EdgeSpeechTTS({ locale: "en-ZH" });

ipcMain.handle("TTS_CREATE", async (e, data) => {
  const payload = {
    input: data.text,
    options: {
      voice: data.voice,
    },
  };
  const res = await tts.create(payload);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Data = buffer.toString("base64");
  const params = {
    ...data,
    url: base64Data,
    status: "success",
  };

  let ttsList = (store.get("ttsList") as Array<any>) || [];
  if (ttsList.length >= 10) {
    ttsList.pop();
  }
  ttsList.unshift(params);
  store.set("ttsList", ttsList);
  return;
});
