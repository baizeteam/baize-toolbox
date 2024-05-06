import React, { useState, useEffect } from "react"
import { Table } from "antd"
import { useTranslation } from "react-i18next"
import { tableCreateTime, DeleteRecordBtn } from "@renderer/utils/tableHelper"
import AppTableHeader from "@siteMain/components/AppTableHeader"
import { PictureOutlined } from "@ant-design/icons"
import platformUtil from "@renderer/utils/platformUtil"
import "./index.module.less"

export default function ScreenShot() {
  const [screenShotList, setScreenShotList] = useState([])
  const { t } = useTranslation()

  const columns = [
    {
      title: t("commonText.image"),
      dataIndex: "base64",
      key: "base64",
      width: 200,
      render: (base64, record) => {
        return (
          <img
            src={base64}
            alt="截图"
            width={180}
            style={{ cursor: "pointer" }}
            onClick={() => {
              window.ipcInvoke("SCREEN_SHOT_OPEN_IMAGE_WIN", { base64: record.base64, cutInfo: record.cutInfo })
            }}
          />
        )
      },
    },
    {
      title: t("commonText.size"),
      dataIndex: "cutInfo",
      key: "cutInfo",
      width: 160,
      render: (cutInfo) => {
        return `${cutInfo.width}*${cutInfo.height}`
      },
    },
    tableCreateTime,
    {
      title: t("commonText.action"),
      dataIndex: "action",
      key: "action",
      width: 200,
      render: (_, record) => {
        return (
          <>
            <DeleteRecordBtn record={record} callback={init} />
          </>
        )
      },
    },
  ]

  const init = async () => {
    const res = await window.ipcInvoke("GET_STORE", "screenShotList")
    console.log(res)
    setScreenShotList(res)
  }

  useEffect(() => {
    init()
    window.ipcOn("SCREEN_RECORD_DATA_CHANGE", init)
    return () => {
      window.electron.ipcRenderer.removeAllListeners("SCREEN_RECORD_DATA_CHANGE")
    }
  }, [])
  return (
    <div styleName="screen-shot" className="common-content">
      <div styleName="screen-shot-btn">
        <div styleName="icon">
          <PictureOutlined />
        </div>
        <p className="ant-upload-text">
          {t(platformUtil.isMac ? "siteMain.pages.screenShot.macCreateText" : "siteMain.pages.screenShot.createText")}
        </p>
      </div>
      <AppTableHeader
        title={"siteMain.pages.screenShot.tableTitle"}
        valueKey="screenShotList"
        onClean={() => setScreenShotList([])}
      />
      <Table
        dataSource={screenShotList}
        columns={columns}
        rowKey={(record) => record.taskId}
        pagination={{ pageSize: 5, total: screenShotList.length }}
      />
    </div>
  )
}
