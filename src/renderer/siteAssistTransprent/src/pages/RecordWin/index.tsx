import React, { useEffect, useRef, useState } from "react"
import "./index.module.less"
import { ffmpegObj2List, COLLECT_TYPE } from "@renderer/utils/ffmpegHelper"
import AppIcon from "@renderer/components/AppIcon"
import { fileSelectAccetps, separator, fpsList } from "@renderer/utils/fileHelper"
import { Select } from "antd"
import { useTranslation } from "react-i18next"
import { nanoid } from "nanoid"
import { usePenetrateListener } from "@renderer/hooks/usePenetrateListener"

const CONTENT_MARGIN_TOP = 36
const CONTENT_MARGIN_LEFT = 8
const SUB_FLODER_NAME = "record"
// 文件格式选项
const fileTypeOptions = [...fileSelectAccetps.video, "gif"].map((item) => ({
  label: item.toUpperCase(),
  value: item,
}))
// 帧率选项
const fpsOptions = fpsList.map((item) => ({
  label: item,
  value: item,
}))

// 取偶数值，防止录屏区域不整
function roundDownEven(num) {
  const _num = Math.floor(num)
  return _num % 2 === 0 ? _num : _num - 1
}

export default function RecordWin() {
  const [isRecording, setIsRecording] = useState(false)
  const [fileType, setFileType] = useState(localStorage.getItem("recordFormatValue") || fileTypeOptions[0].value)
  const [fps, setFps] = useState(localStorage.getItem("recordFpsValue") || fpsOptions[0].value)
  const contentRef = useRef<HTMLDivElement>(null)

  usePenetrateListener(contentRef)
  const { t } = useTranslation()

  const isGif = fileType === "gif"

  // 格式选择
  const handleFormatChange = (value) => {
    localStorage.setItem("recordFormatValue", value)
    setFileType(value)
  }

  // 帧率选择
  const handleFpsChange = (value) => {
    localStorage.setItem("recordFpsValue", value)
    setFps(value)
  }

  // 开始录屏
  const handleRecordStart = async () => {
    if (!contentRef.current) return
    const bounds = await window.ipcInvoke("SCREEN_RECORD_GET_CURRENT_INFO")
    setIsRecording(true)
    const contentBounds = contentRef.current.getBoundingClientRect()
    // const offset = `+${bounds.x},${bounds.y}`;
    const fileName = `${Date.now()}.${fileType}`
    
    const width = roundDownEven(contentBounds.width * bounds.scaleFactor);
    const height = roundDownEven(contentBounds.height * bounds.scaleFactor);
    const x =  bounds.x + CONTENT_MARGIN_LEFT * bounds.scaleFactor + "";
    const y = (bounds.y + CONTENT_MARGIN_TOP) * bounds.scaleFactor + "";
    const screenArea = `${width}x${height}`

    const outputFloaderPath = await window.ipcInvoke("GET_STORE", "defaultOutPath")
    const subOutputFloaderPath = `${outputFloaderPath}${separator}${SUB_FLODER_NAME}`
    const isMac = window.electron.process.platform === 'darwin'

    const commandObj = {
      "-f": COLLECT_TYPE[window.electron.process.platform],
      "-framerate": isGif ? "10" : String(fps),
      // "-offset_x": (bounds.x + CONTENT_MARGIN_LEFT) * bounds.scaleFactor + "", 命令不支持
      // "-offset_y": (bounds.y + CONTENT_MARGIN_TOP) * bounds.scaleFactor + "",
      "-video_size": screenArea,
      "-i": isMac ? `Capture screen ${bounds.screenIndex}` : 'desktop',
      "-pix_fmt": "yuv420p",
      '-vsync':'vfr',
      '-vf' : `crop=${width}:${height}:${x}:${y}`,
      // "-c:v": "libx264",
      [`${subOutputFloaderPath}${separator}${fileName}`]: null,
    }
    // {
    //   "-f": "avfoundation",
    //   "-framerate": "30",
    //   "-video_size": screenArea,
    //   "-i": ":0.0" + offset,
    //   "-c:v": "libx264",
    //   "-preset": "ultrafast",
    //   ["/Users/xiaoyu/Documents/output/" + fileName]: null,
    // };
    const command = ffmpegObj2List(commandObj)
    const taskId = nanoid(16)
    window.ipcInvoke("SCREEN_RECORD_START", {
      command,
      code: "screenRecord",
      taskId,
      outputFloaderPath: subOutputFloaderPath,
      outputFileName: fileName,
      createType: fileType,
      createTime: Date.now(),
      fps,
    })
  }

  // 停止录屏
  const handleRecordStop = async () => {
    setIsRecording(false)
    window.ipcInvoke("SCREEN_RECORD_STOP").then((res) => {
      console.log(res)
    })
  }

  return (
    <div styleName="record-win">
      <div styleName="header">
        <div styleName="title">{t("siteAssistTransprent.pages.recordWin.title")}</div>
        <AppIcon
          styleName="close-btn"
          icon="#baize-guanbi"
          onClick={() => {
            window.ipcSend("WIN_HIDE")
          }}
        />
      </div>
      <div styleName="content" ref={contentRef}></div>
      <div styleName="footer">
        <div styleName="left">
          {isRecording ? (
            <AppIcon styleName="not-drag record-btn" icon="#baize-lianxi2hebing-15" onClick={handleRecordStop} />
          ) : (
            <AppIcon styleName="not-drag record-btn" icon="#baize-kaishi" onClick={handleRecordStart} />
          )}
        </div>
        <div styleName="right">
          {!isGif && (
            <div styleName="record-select">
              <div styleName="label">{t("commonText.fps")}</div>
              <Select
                virtual={false}
                size="small"
                popupClassName="record-select-popup"
                style={{ width: 56 }}
                value={fps}
                styleName="not-drag"
                placement="topRight"
                options={fpsOptions}
                onChange={handleFpsChange}
              />
            </div>
          )}

          <div styleName="record-select">
            <div styleName="label">格式</div>
            <Select
              virtual={false}
              size="small"
              popupClassName="record-select-popup"
              style={{ width: 86 }}
              value={fileType}
              styleName="not-drag"
              placement="topRight"
              options={fileTypeOptions}
              onChange={handleFormatChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
