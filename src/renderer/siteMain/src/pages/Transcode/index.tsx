import React, { useEffect, useRef, useState } from "react"
import { Button, Table, message } from "antd"
import AppSelectFile from "@siteMain/components/AppSelectFile"
import TranscodeTypeModal from "./components/TranscodeTypeModal"
import "./index.module.less"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { ROUTERS } from "@siteMain/router/ROUTERS"
import { ffmpegObj2List, getTaskBaseInfo } from "@renderer/utils/ffmpegHelper"
import platformUtil from "@renderer/utils/platformUtil"
import { fileSelectAccetps } from "@renderer/utils/fileHelper"
import {
  tableOriginFile,
  tableProgress,
  tableCreateTime,
  OpenFileBtn,
  OpenFolderBtn,
  DeleteRecordBtn,
} from "@renderer/utils/tableHelper"
import AppTableHeader from "@siteMain/components/AppTableHeader"

const SUB_FLODER_NAME = "transcode"
const accept = [...fileSelectAccetps.video, ...fileSelectAccetps.audio].map((item) => `.${item}`).join(",")

export default function Transcode() {
  const [filePath, setFilePath] = useState(null)
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [transcodeList, setTranscodeList] = useState([])
  const transcodeListRef = useRef(transcodeList)
  const { t } = useTranslation()
  const { pathname } = useLocation()

  // 选择文件
  const selectFile = async (e) => {
    if (e.file.originFileObj.path) {
      setFilePath(e.file.originFileObj.path)
      setShowTypeModal(true)
    }
  }

  // 更新转码列表
  const changeTranscodeList = (list) => {
    transcodeListRef.current = list
    setTranscodeList(list)
  }

  // 转码
  const handleFile = async (outputType) => {
    setShowTypeModal(false)
    const baseInfo = await getTaskBaseInfo({
      filePath,
      outputType,
      subFloder: SUB_FLODER_NAME,
    })
    const params = {
      command: ffmpegObj2List({
        "-i": filePath,
        "-c:v": platformUtil.isMac ? "h264_videotoolbox" : "h264",
        "-preset": "fast",
        "-c:a": "aac",
        "-strict": "experimental",
      }),
      ...baseInfo,
      code: "transcode",
    }
    changeTranscodeList([params, ...(transcodeListRef.current || [])])
    window.ipcSend("FFMPEG_COMMAND", params)
    window.ipcOn(`FFMPEG_PROGRESS_${baseInfo.taskId}`, (e, data) => onProgressChange(e, data, baseInfo.taskId))
  }

  // 转码进度
  const onProgressChange = (e, data, taskId) => {
    changeTranscodeList([
      ...transcodeListRef.current?.map((item) => {
        if (item?.taskId === taskId) {
          item.progress = data.progress
        }
        return item
      }),
    ])
    if (data.progress === 100) {
      window.electron.ipcRenderer.removeAllListeners(`FFMPEG_PROGRESS_${taskId}`)
    }
  }

  const columns = [
    tableOriginFile,
    {
      title: t("siteMain.pages.transcode.transcodeType"),
      dataIndex: "outputType",
      key: "outputType",
      width: 160,
    },
    tableProgress,
    tableCreateTime,
    {
      title: t("commonText.action"),
      dataIndex: "action",
      key: "action",
      width: 200,
      render: (_, record) => {
        return (
          <>
            <OpenFileBtn record={record} />
            <OpenFolderBtn record={record} />
            <DeleteRecordBtn record={record} hasFile callback={init} />
          </>
        )
      },
    },
  ]

  const init = () => {
    window.electron.ipcRenderer.invoke("GET_STORE", "transcodeList").then((res) => {
      changeTranscodeList(res)
    })
  }

  useEffect(() => {
    if (pathname === ROUTERS.TRANSCODE) {
      init()
    }
  }, [pathname])
  return (
    <div styleName="transcode" className="common-content">
      <AppSelectFile onChange={selectFile} accept={accept} />
      <AppTableHeader
        title={"siteMain.pages.transcode.tableTitle"}
        valueKey="transcodeList"
        onClean={() => setTranscodeList([])}
      />
      <Table
        styleName="table"
        columns={columns}
        dataSource={transcodeList}
        rowKey={"taskId"}
        pagination={{ pageSize: 5, total: transcodeList.length }}
      />
      <TranscodeTypeModal open={showTypeModal} onCancel={() => setShowTypeModal(false)} onOk={handleFile} />
    </div>
  )
}
