import React, { useState, useEffect } from "react"
import { Table } from "antd"
import { useTranslation } from "react-i18next"
import { tableFile, tableCreateTime, OpenFileBtn, OpenFolderBtn, DeleteRecordBtn } from "@renderer/utils/tableHelper"
import AppTableHeader from "@siteMain/components/AppTableHeader"
import { PictureOutlined } from "@ant-design/icons"
import "./index.module.less"

export default function ScreenShot() {
  const [screenShotList, setScreenShotList] = useState([])
  const { t } = useTranslation()
  const openScreenShotWin = () => {
    window.ipcSend("OPEN_RECORD_WIN")
  }

  const columns = [
    tableFile,
    {
      title: t("commonText.size"),
      dataIndex: "createType",
      key: "createType",
      width: 160,
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
            <OpenFileBtn record={record} />
            <OpenFolderBtn record={record} />
            <DeleteRecordBtn record={record} hasFile callback={init} />
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
      {/* <AppFunctionDev /> */}
      <div styleName="screen-shot-btn" onClick={openScreenShotWin}>
        <div styleName="icon">
          <PictureOutlined />
        </div>
        <p className="ant-upload-text">{t("siteMain.pages.screenShot.createBtn")}</p>
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
