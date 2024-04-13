import React, { useState, useEffect } from "react";
import AppFunctionDev from "@siteMain/components/AppFuctionDev";
import { Table } from "antd";
import { useTranslation } from "react-i18next";
import {
  tableFile,
  tableCreateTime,
  OpenFileBtn,
  OpenFolderBtn,
} from "@renderer/utils/tableHelper";
import AppTableHeader from "@siteMain/components/AppTableHeader";
import { VideoCameraOutlined } from "@ant-design/icons";
import "./index.module.less";

export default function ScreenRecord() {
  const [screenRecordList, setScreenRecordList] = useState([]);
  const { t } = useTranslation();
  const openScreenRecordWin = () => {
    window.electron.ipcRenderer.send("OPEN_RECORD_WIN");
  };

  const columns = [
    tableFile,
    {
      title: t("siteMain.pages.screenRecord.createType"),
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
            {/* <Button
              type="link"
              className="common-table-link-btn"
              onClick={() => {
                openDeleteFileModal(
                  `${record.outputFloaderPath}${separator}${record.outputFileName}`,
                  record,
                );
              }}
            >
              {t("commonText.delete")}
            </Button> */}
          </>
        );
      },
    },
  ];

  const init = async () => {
    const res = await window.electron.ipcRenderer.invoke(
      "GET_STORE",
      "screenRecordList",
    );
    console.log(res);
    setScreenRecordList(res);
  };

  useEffect(() => {
    init();
    window.electron.ipcRenderer.on("SCREEN_RECORD_DATA_CHANGE", init);
    return () => {
      window.electron.ipcRenderer.removeAllListeners(
        "SCREEN_RECORD_DATA_CHANGE",
      );
    };
  }, []);
  return (
    <div styleName="screen-record" className="common-content">
      {/* <AppFunctionDev /> */}
      <div styleName="screen-record-btn" onClick={openScreenRecordWin}>
        <div styleName="icon">
          <VideoCameraOutlined />
        </div>
        <p className="ant-upload-text">
          {t("siteMain.pages.screenRecord.createBtn")}
        </p>
      </div>
      <AppTableHeader
        title={"siteMain.pages.screenRecord.tableTitle"}
        valueKey="screenRecordList"
        onClean={() => setScreenRecordList([])}
      />
      <Table
        dataSource={screenRecordList}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 5, total: screenRecordList.length }}
      />
    </div>
  );
}
