import React, { useEffect, useRef, useState } from "react"
import { Table } from "antd"
import AppSelectFile from "@siteMain/components/AppSelectFile"
import TypeModal from "./components/TypeModal"
import "./index.module.less"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { ROUTERS } from "@siteMain/router/ROUTERS"
import { ffmpegObj2List, getTaskBaseInfo } from "@renderer/utils/ffmpegHelper"
import { fileSelectAccetps, formatFileSize } from "@renderer/utils/fileHelper"
import {
  tableOriginFile,
  tableProgress,
  tableCreateTime,
  OpenFileBtn,
  OpenFolderBtn,
  DeleteRecordBtn
} from "@renderer/utils/tableHelper"
import AppTableHeader from "@siteMain/components/AppTableHeader"

const SUB_FLODER_NAME = "compress"

const accept = [...fileSelectAccetps.video] // [...fileSelectAccetps.video, ...fileSelectAccetps.audio]
  .map((item) => `.${item}`)
  .join(",")

export default function Compress() {
  const [filePath, setFilePath] = useState(null)
  const [fileSize, setFileSize] = useState(null)
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [compressList, setCompressList] = useState([])
  const compressListRef = useRef(compressList)
  const { t } = useTranslation()
  const { pathname } = useLocation()

  // 选择文件
  const selectFile = async (e) => {
    if (e.file.originFileObj.path) {
      setFilePath(e.file.originFileObj.path)
      setFileSize(e.file.originFileObj.size)
      setShowTypeModal(true)
    }
  }

  // 更新转码列表
  const changeCompressList = (list) => {
    compressListRef.current = list
    setCompressList(list)
  }

  // 转码
  const handleFile = async (configData) => {
    setShowTypeModal(false)
    console.log(configData)
    const baseInfo = await getTaskBaseInfo({
      filePath,
      subFloder: SUB_FLODER_NAME
    })
    console.log(baseInfo)
    const commandObj = {
      "-i": filePath,
      "-b:v": configData.bitrate + "k",
      // "-b:a": configData.audioBitrate,
      "-r": configData.frameRate
    }
    const command = ffmpegObj2List(commandObj)
    const params = {
      command: [...command],
      ...baseInfo,
      originFileSize: fileSize,
      code: "compress"
    }
    changeCompressList([params, ...(compressListRef.current || [])])
    window.ipcSend("FFMPEG_COMMAND", params)
    window.ipcOn(`FFMPEG_PROGRESS_${baseInfo.taskId}`, (e, data) => onProgressChange(e, data, baseInfo.taskId))
  }

  // 进度
  const onProgressChange = (e, data, taskId) => {
    changeCompressList([
      ...compressListRef.current?.map((item) => {
        if (item?.taskId === taskId) {
          item = {
            ...item,
            progress: data.progress,
            outputFileSize: data.outputFileSize
          }
        }
        return item
      })
    ])
    if (data.progress === 100) {
      window.electron.ipcRenderer.removeAllListeners(`FFMPEG_PROGRESS_${taskId}`)
    }
  }

  const columns = [
    tableOriginFile,
    {
      title: t("siteMain.pages.compress.originFileSize"),
      dataIndex: "originFileSize",
      key: "originFileSize",
      width: 160,
      render: (text) => formatFileSize(text)
    },
    {
      title: t("siteMain.pages.compress.compressFileSize"),
      dataIndex: "outputFileSize",
      key: "outputFileSize",
      width: 160,
      render: (text) => (text ? formatFileSize(text) : "-")
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
      }
    }
  ]

  const init = () => {
    window.electron.ipcRenderer.invoke("GET_STORE", "compressList").then((res) => {
      console.log(res)
      changeCompressList(res)
    })
  }

  useEffect(() => {
    if (pathname === ROUTERS.COMPRESS) {
      init()
    }
  }, [pathname])
  return (
    <div styleName="compress" className="common-content">
      <AppSelectFile onChange={selectFile} accept={accept} />
      <AppTableHeader
        title={"siteMain.pages.compress.tableTitle"}
        valueKey="compressList"
        onClean={() => setCompressList([])}
      />
      <Table
        styleName="table"
        columns={columns}
        dataSource={compressList}
        rowKey={"taskId"}
        pagination={{ pageSize: 5, total: compressList.length }}
      />
      <TypeModal filePath={filePath} open={showTypeModal} onCancel={() => setShowTypeModal(false)} onOk={handleFile} />
    </div>
  )
}
