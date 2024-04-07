import React from "react";
import { useState } from "react";
import { Button, message, Upload, Radio } from "antd";
import { nanoid } from "nanoid";
import "./index.module.less";

const { Dragger } = Upload;

const VideoList = [
  { label: "MP4", value: ".mp4" },
  { label: "MKV", value: ".mkv" },
  { label: "FLV", value: ".flv" },
  { label: "AVI", value: ".avi" },
  { label: "WMV", value: ".wmv" },
  { label: "MOV", value: ".mov" },
  { label: "3GP", value: ".3gp" },
  { label: "OGG", value: ".ogg" },
];

export default function Transcode() {
  const [filePath, setFilePath] = useState(null);
  const selectFile = async () => {
    const res = await window.electron.ipcRenderer.invoke("WIN_SELECT_FILE");
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
    window.Electron.ipcRenderer.send("FFMPEG_COMMAND", {
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
    <div styleName="transcode">
      <Button onClick={selectFile}>select file</Button>
      <Button onClick={handleFile}> handleFile</Button>
      <Dragger
        customRequest={(e) => {
          console.log(e);
        }}
        showUploadList={false}
      >
        <div>请选择文件</div>
      </Dragger>
      <div styleName="action">
        <div>
          <span styleName="label">请选择转换格式</span>
          <Radio.Group>
            {VideoList.map((item) => (
              <Radio value={item.value} key={item.value}>
                {item.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
        <Button onClick={handleFile} type="primary">
          转换
        </Button>
      </div>
    </div>
  );
}
