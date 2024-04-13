import React, { useRef, useState } from "react";
import "./index.module.less";
import { ffmpegObj2List } from "@renderer/utils/ffmpegHelper";
import AppIcon from "@renderer/components/AppIcon";
import { fileSelectAccetps } from "@renderer/utils/fileHelper";
import { Select } from "antd";
import { separator } from "@renderer/utils/fileHelper";
import { useTranslation } from "react-i18next";
import { nanoid } from "nanoid";

const CONTENT_MARGIN_TOP = 36;
const CONTENT_MARGIN_LEFT = 8;
const SUB_FLODER_NAME = "record";
const options = [...fileSelectAccetps.video, "gif"].map((item) => ({
  label: item.toUpperCase(),
  value: item,
}));

function roundDownEven(num) {
  const _num = Math.floor(num);
  return _num % 2 === 0 ? _num : _num - 1;
}

export default function RecordWin() {
  const [isRecording, setIsRecording] = useState(false);
  const [value, setValue] = useState(
    localStorage.getItem("recordFormatValue") || options[0].value,
  );
  const contentRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  // 格式选择
  const handleFormatChange = (value) => {
    localStorage.setItem("recordFormatValue", value);
    setValue(value);
  };

  // 开始录屏
  const handleRecordStart = async () => {
    const bounds = await window.electron.ipcRenderer.invoke(
      "SCREEN_GET_CURRENT_INFO",
    );
    setIsRecording(true);
    const contentBounds = contentRef.current.getBoundingClientRect();
    const screenArea = `${roundDownEven(contentBounds.width * bounds.scaleFactor)}x${roundDownEven(contentBounds.height * bounds.scaleFactor)}`;
    // const offset = `+${bounds.x},${bounds.y}`;
    const fileName = `${Date.now()}.${value}`;
    const formatObj = {
      win32: "gdigrab",
      darwin: "avfoundation",
      linux: "x11grab",
    };
    const outputFloaderPath = await window.electron.ipcRenderer.invoke(
      "GET_STORE",
      "defaultOutPath",
    );
    const subOutputFloaderPath = `${outputFloaderPath}${separator}${SUB_FLODER_NAME}`;
    const commandObj = {
      "-f": formatObj[window.electron.process.platform],
      "-framerate": "30",
      "-offset_x": (bounds.x + CONTENT_MARGIN_LEFT) * bounds.scaleFactor + "",
      "-offset_y": (bounds.y + CONTENT_MARGIN_TOP) * bounds.scaleFactor + "",
      "-video_size": screenArea,
      "-i": "desktop",
      "-pix_fmt": "yuv420p",
      // "-c:v": "libx264",
      [`${subOutputFloaderPath}${separator}${fileName}`]: null,
    };
    // {
    //   "-f": "avfoundation",
    //   "-framerate": "30",
    //   "-video_size": screenArea,
    //   "-i": ":0.0" + offset,
    //   "-c:v": "libx264",
    //   "-preset": "ultrafast",
    //   ["/Users/xiaoyu/Documents/output/" + fileName]: null,
    // };
    const command = ffmpegObj2List(commandObj);
    const taskId = nanoid(16);
    window.electron.ipcRenderer.invoke("SCREEN_RECORD_START", {
      command,
      code: "screenRecord",
      taskId,
      outputFloaderPath: subOutputFloaderPath,
      outputFileName: fileName,
      createType: value,
    });
  };

  // 停止录屏
  const handleRecordStop = async () => {
    setIsRecording(false);
    window.electron.ipcRenderer.invoke("SCREEN_RECORD_STOP").then((res) => {
      console.log(res);
    });
  };

  return (
    <div styleName="record-win">
      <div styleName="header">
        <div styleName="title">{t("siteAssist.pages.recordWin.title")}</div>
        <AppIcon
          styleName="close-btn"
          icon="#baize-guanbi"
          onClick={() => {
            window.electron.ipcRenderer.send("WIN_HIDE");
          }}
        />
      </div>
      <div styleName="content" ref={contentRef}></div>
      <div styleName="footer">
        <div styleName="left">
          {isRecording ? (
            <AppIcon
              styleName="not-drag record-btn"
              icon="#baize-lianxi2hebing-15"
              onClick={handleRecordStop}
            />
          ) : (
            <AppIcon
              styleName="not-drag record-btn"
              icon="#baize-kaishi"
              onClick={handleRecordStart}
            />
          )}
        </div>
        <div styleName="right">
          <Select
            virtual={false}
            size="small"
            popupClassName="record-format-select"
            style={{ width: 100 }}
            value={value}
            styleName="not-drag"
            placement="topRight"
            options={options}
            onChange={handleFormatChange}
          />
        </div>
      </div>
    </div>
  );
}
