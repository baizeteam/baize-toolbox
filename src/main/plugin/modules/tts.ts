import { EdgeSpeechTTS } from "@lobehub/tts";
import WebSocket from "ws";
import { ipcMain } from "electron";
import { queueStoreAdd, queueStoreUpdate } from "../../utils/storeHelper";

global.WebSocket = WebSocket;
const tts = new EdgeSpeechTTS({ locale: "en-ZH" });

ipcMain.handle("TTS_CREATE", async (e, data) => {
  queueStoreAdd({ params: data, key: "ttsList" });
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
  queueStoreUpdate({ params, key: "ttsList", idKey: "id" });
  return;
});
