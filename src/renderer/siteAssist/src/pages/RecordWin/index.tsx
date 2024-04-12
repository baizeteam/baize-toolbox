import React, { useRef, useState } from "react";
import "./index.module.less";
import { ffmpegObj2List } from "@renderer/utils/ffmpegHelper";

const Kbps = 1000;

export default function RecordWin() {
  const recordDataRef = useRef([]);
  const mediaRecorderRef = useRef(null);

  const getBuffer = async (recordData) => {
    const buffer: ArrayBuffer[] = [];
    const promiseList: Promise<void>[] = [];
    for (let i = 0; i < recordData.length; i++) {
      const reader = new FileReader();
      const blob = recordData[i];
      const p = new Promise<void>((resolve) => {
        console.log(
          "%c [ reader ]-18",
          "font-size:13px; background:pink; color:#bf2c9f;",
          reader,
          blob,
        );

        reader.readAsArrayBuffer(blob);
        reader.onload = () => {
          buffer[i] = reader.result as ArrayBuffer;
          resolve();
        };
      });
      promiseList.push(p);
    }
    await Promise.all(promiseList);
    // 将buffer数组处理为一个buffer
    const mergedBuffer = new Uint8Array(
      buffer.reduce((acc, cur) => acc + cur.byteLength, 0),
    );
    for (let i = 0, offset = 0; i < recordData.length; i++) {
      mergedBuffer.set(new Uint8Array(buffer[i]), offset);
      offset += buffer[i].byteLength;
    }
    return mergedBuffer;
  };

  // 获取视频流
  async function getDisplayStream(id: string) {
    const displayOptions: any = {
      audio: {
        mandatory: {
          chromeMediaSource: "desktop",
        },
      },
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: id,
        },
      },
    };
    return await navigator.mediaDevices.getUserMedia(displayOptions);
  }

  // 获取音频流
  async function getAudioStream() {
    // mac 系统下，录制音频需要额外使用别的工具 （但是在chrome插件里是可以做到录制麦克风音频的）
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      return audioStream;
    } catch (error) {
      return new MediaStream();
    }
  }

  // // 开始录制
  // const handleRecordStart = async () => {
  //   const source = await window.electron.ipcRenderer.invoke(
  //     "SCREEN_RECORD_START",
  //   );
  //   const displayStream = await getDisplayStream(source.id);
  //   const audioStream = await getAudioStream();
  //   const combinedStream = new MediaStream([
  //     ...displayStream.getTracks(),
  //     ...audioStream.getTracks(),
  //   ]);
  //   mediaRecorderRef.current = new MediaRecorder(combinedStream);
  //   mediaRecorderRef.current.addEventListener("dataavailable", (e) => {
  //     if (e.data.size > 0) {
  //       recordDataRef.current.push(e.data);
  //       console.log(
  //         "%c [ e.data ]-90",
  //         "font-size:13px; background:pink; color:#bf2c9f;",
  //         e.data,
  //       );
  //     }
  //   });
  //   mediaRecorderRef.current.start();
  // };

  // // 停止录制
  // const handleRecordStop = async () => {
  //   mediaRecorderRef.current?.stop();
  //   setTimeout(async () => {
  //     console.log(recordDataRef.current);
  //     const buffer = await getBuffer(recordDataRef.current);
  //     window.electron.ipcRenderer.invoke("WIN_DOWNLOAD_FILE", {
  //       file: buffer,
  //       path: "/Users/xiaoyu/Documents/output/record.webm",
  //     });
  //   }, 3000);
  // };

  const handleRecordStart = async () => {
    const bounds = await window.electron.ipcRenderer.invoke(
      "SCREEN_GET_CURRENT_INFO",
    );
    const screenArea = `${bounds.width}x${bounds.height}`;
    const offset = `+${bounds.x},${bounds.y}`;
    const commandObj = {
      "-f": "avfoundation",
      "-framerate": "30",
      "-video_size": screenArea,
      "-i": ":0.0" + offset,
      "-c:v": "libx264",
      "-preset": "ultrafast",
      "/Users/xiaoyu/Documents/output/record.mp4": null,
    };
    const command = ffmpegObj2List(commandObj);
    const res = window.electron.ipcRenderer.invoke("SCREEN_RECORD_START", {
      command,
    });
    console.log(
      "%c [ res ]-131",
      "font-size:13px; background:pink; color:#bf2c9f;",
      res,
    );
  };

  const handleRecordStop = async () => {
    window.electron.ipcRenderer.invoke("SCREEN_RECORD_STOP").then((res) => {
      console.log(res);
    });
  };
  return (
    <div styleName="record-win">
      <div styleName="content"></div>
      <div styleName="footer">
        <button onClick={handleRecordStart}>开始录制</button>
        <button onClick={handleRecordStop}>停止录制</button>
        {/* <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "停止录制" : "开始录制"}
        </button> */}
      </div>
    </div>
  );
}
