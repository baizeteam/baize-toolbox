import React from "react";
import { useState } from "react";
import { Button } from "antd";
import { nanoid } from "nanoid";

export default function Translate() {
  const [filePath, setFilePath] = useState(null);
  const selectFile = async () => {
    const res = await window.api.selectFile();
    setFilePath(res[0]);
    console.log(res);
  };

  const handleFile = () => {
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
