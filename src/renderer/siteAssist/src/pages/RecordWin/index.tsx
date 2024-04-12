import React, { useRef, useState } from "react";
import "./index.module.less";
import { ffmpegObj2List } from "@renderer/utils/ffmpegHelper";
import platformUtil from "@renderer/utils/platformUtil";

const Kbps = 1000;

function roundDownEven(num) {
  const _num = Math.floor(num);
  return _num % 2 === 0 ? _num : _num - 1;
}

export default function RecordWin() {
  const handleRecordStart = async () => {
    const bounds = await window.electron.ipcRenderer.invoke(
      "SCREEN_GET_CURRENT_INFO",
    );
    console.log(bounds);

    const screenArea = `${roundDownEven(bounds.width)}x${roundDownEven(bounds.height)}`;
    const offset = `+${bounds.x},${bounds.y}`;
    const fileName = Date.now() + ".mp4";
    const commandObj = platformUtil.isWin
      ? {
          "-f": "gdigrab",
          "-framerate": "30",
          "-offset_x": bounds.x + "",
          "-offset_y": bounds.y + "",
          "-video_size": screenArea,
          "-i": "desktop",
          "-pix_fmt": "yuv420p",
          "-c:v": "libx264",
          ["C:\\Users\\xiaoyu\\Documents\\output\\" + fileName]: null,
        }
      : {
          "-f": "avfoundation",
          "-framerate": "30",
          "-video_size": screenArea,
          "-i": ":0.0" + offset,
          "-c:v": "libx264",
          "-preset": "ultrafast",
          ["/Users/xiaoyu/Documents/output/" + fileName]: null,
        };
    const command = ffmpegObj2List(commandObj);
    const res = window.electron.ipcRenderer.invoke("SCREEN_RECORD_START", {
      command,
    });
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
