import React, { useEffect, useRef, useState } from "react";
import { Button, Table, message } from "antd";
import AppSelectFile from "@siteMain/components/AppSelectFile";
import TypeModal from "./components/TypeModal";
import "./index.module.less";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { ROUTERS } from "@siteMain/router/ROUTERS";
import DeleteModal from "@siteMain/components/DeleteModal";
import { ffmpegObj2List, getTaskBaseInfo } from "@renderer/utils/ffmpegHelper";
import {
  openFile,
  openFolder,
  separator,
  fileSelectAccetps,
} from "@renderer/utils/fileHelper";
import {
  tableOriginFile,
  tableProgress,
  tableCreateTime,
} from "@renderer/utils/tableHelper";
import AppTableHeader from "@siteMain/components/AppTableHeader";

const SUB_FLODER_NAME = "extract";

const accept = [...fileSelectAccetps.video, ...fileSelectAccetps.audio]
  .map((item) => `.${item}`)
  .join(",");

export default function Extract() {
  const [filePath, setFilePath] = useState(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({
    visible: false,
    path: "",
    params: null,
  });
  const [extractList, setExtractList] = useState([]);
  const extractListRef = useRef(extractList);
  const { t } = useTranslation();
  const { pathname } = useLocation();

  // 选择文件
  const selectFile = async (e) => {
    if (e.file.path) {
      setFilePath(e.file.path);
      setShowTypeModal(true);
    }
  };

  // 删除记录
  const deleteData = async ({ path, isDeleteFile }) => {
    console.log(path, isDeleteFile);
    console.log(deleteModalData.params.taskId);
    closeDeleteFileModal();
    const recordDeleteRes = window.electron.ipcRenderer.invoke(
      "QUEUE_STORE_DELETE",
      {
        key: "extractList",
        idKey: "taskId",
        id: deleteModalData.params.taskId,
      },
    );
    if (isDeleteFile) {
      const res = await window.electron.ipcRenderer.invoke("WIN_DELETE_FILE", {
        path,
      });
      res
        ? message.success(t("commonText.success"))
        : message.error(t("commonText.error"));
    } else {
      recordDeleteRes
        ? message.success(t("commonText.success"))
        : message.error(t("commonText.error"));
    }
    init();
  };

  // 打开删除文件弹窗
  const openDeleteFileModal = (path, record) => {
    setDeleteModalData({
      visible: true,
      path,
      params: record,
    });
  };

  // 关闭删除文件弹窗
  const closeDeleteFileModal = () => {
    setDeleteModalData({
      visible: false,
      path: "",
      params: null,
    });
  };

  // 更新转码列表
  const changeExtractList = (list) => {
    extractListRef.current = list;
    setExtractList(list);
  };

  // 转码
  const handleFile = async (outputType) => {
    setShowTypeModal(false);
    const baseInfo = await getTaskBaseInfo(
      filePath,
      outputType,
      SUB_FLODER_NAME,
    );
    const commandObj = {
      "-i": filePath,
    };
    if (outputType === "mp4") {
      commandObj["-an"] = "-vcodec";
      commandObj["copy"] = null;
    }
    const command = ffmpegObj2List(commandObj);
    const params = {
      command: [...command],
      ...baseInfo,
      code: "extract",
    };
    changeExtractList([params, ...(extractListRef.current || [])]);
    window.electron.ipcRenderer.send("FFMPEG_COMMAND", params);
    window.electron.ipcRenderer.on(
      `FFMPEG_PROGRESS_${baseInfo.taskId}`,
      (e, data) => onProgressChange(e, data, baseInfo.taskId),
    );
  };

  // 转码进度
  const onProgressChange = (e, data, taskId) => {
    changeExtractList([
      ...extractListRef.current?.map((item) => {
        if (item?.taskId === taskId) {
          item.progress = data.progress;
        }
        return item;
      }),
    ]);
    if (data.progress === 100) {
      window.electron.ipcRenderer.removeAllListeners(
        `FFMPEG_PROGRESS_${taskId}`,
      );
    }
  };

  const columns = [
    tableOriginFile,
    {
      title: t("siteMain.pages.extract.extractType"),
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
            <Button
              onClick={() =>
                openFile(
                  `${record.outputFloaderPath}${separator}${record.outputFileName}`,
                )
              }
              type="link"
              className="common-table-link-btn"
            >
              {t("commonText.openFile")}
            </Button>
            <Button
              onClick={() => openFolder(record.outputFloaderPath)}
              type="link"
              className="common-table-link-btn"
            >
              {t("commonText.openFolder")}
            </Button>
            <Button
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
            </Button>
          </>
        );
      },
    },
  ];

  const init = () => {
    window.electron.ipcRenderer
      .invoke("GET_STORE", "extractList")
      .then((res) => {
        changeExtractList(res);
      });
  };

  useEffect(() => {
    if (pathname === ROUTERS.EXTRACT) {
      init();
    }
  }, [pathname]);
  return (
    <div styleName="extract" className="common-content">
      <AppSelectFile onSelectFile={selectFile} accept={accept} />
      <AppTableHeader
        title={"siteMain.pages.extract.tableTitle"}
        valueKey="extractList"
        onClean={() => setExtractList([])}
      />
      <Table
        styleName="table"
        columns={columns}
        dataSource={extractList}
        rowKey={"taskId"}
        pagination={{ pageSize: 5, total: extractList.length }}
      />
      <TypeModal
        open={showTypeModal}
        onCancel={() => setShowTypeModal(false)}
        onOk={handleFile}
      />
      <DeleteModal
        open={deleteModalData.visible}
        path={deleteModalData.path}
        onCancel={closeDeleteFileModal}
        onOk={deleteData}
      />
    </div>
  );
}
