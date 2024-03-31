import React from "react";
import { useState } from "react";
import { Button, message } from "antd";
import { nanoid } from "nanoid";
import "./index.module.less";

export default function Transcode() {
  const [filePath, setFilePath] = useState(null);
  const selectFile = async () => {
    const res = await window.api.selectFile();
    if (res) {
      console.log(res);
      setFilePath(res[0]);
    }
  };

  const handleFile = () => {
    if (!filePath) {
      message.error("请先选择文件");
      return;
    }
    const outputFileName = `${new Date().getTime()}.mp4`;
    const taskId = nanoid(16);
    window.api.ffmpegCommand({
      command: [
        "-i",
        filePath,
        "-c:v",
        "h264",
        "-c:a",
        "aac",
        "-strict",
        "experimental",
      ],
      taskId,
      inputFilePath: filePath,
      outputFileName,
    });
    window.electron.ipcRenderer.on(`FFMPEG_PROGRESS_${taskId}`, (e, data) => {
      console.log(data);
    });
  };
  return (
    <div>
      <Button onClick={selectFile}>select file</Button>
      <Button onClick={handleFile}> handleFile</Button>
    </div>
  );
}
