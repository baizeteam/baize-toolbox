import React, { useState } from "react";
import AppFunctionDev from "@siteMain/components/AppFuctionDev";
import { Table } from "antd";
import { useTranslation } from "react-i18next";
import { tableCreateTime } from "@renderer/utils/tableHelper";
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
    tableCreateTime,
    {
      title: t("siteMain.pages.screenRecord.createType"),
      dataIndex: "type",
      key: "type",
      width: 160,
    },
    // {
    //   title: t("commonText.action"),
    //   dataIndex: "action",
    //   key: "action",
    //   width: 200,
    //   render: (_, record) => {
    //     return (
    //       <>
    //         <Button
    //           onClick={() =>
    //             openFile(
    //               `${record.outputFloaderPath}${separator}${record.outputFileName}`,
    //             )
    //           }
    //           type="link"
    //           className="common-table-link-btn"
    //         >
    //           {t("commonText.openFile")}
    //         </Button>
    //         <Button
    //           onClick={() => openFolder(record.outputFloaderPath)}
    //           type="link"
    //           className="common-table-link-btn"
    //         >
    //           {t("commonText.openFolder")}
    //         </Button>
    //         <Button
    //           type="link"
    //           className="common-table-link-btn"
    //           onClick={() => {
    //             openDeleteFileModal(
    //               `${record.outputFloaderPath}${separator}${record.outputFileName}`,
    //               record,
    //             );
    //           }}
    //         >
    //           {t("commonText.delete")}
    //         </Button>
    //       </>
    //     );
    //   },
    // },
  ];
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
