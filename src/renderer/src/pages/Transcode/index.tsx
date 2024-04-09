import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Progress, message } from "antd";
import { nanoid } from "nanoid";
import AppSelectFile from "@renderer/components/AppSelectFile";
import TranscodeTypeModal from "./components/TranscodeTypeModal";
import { formatTime } from "@renderer/utils/formatTime";
import "./index.module.less";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { ROUTERS } from "@renderer/router/ROUTERS";
import DeleteModal from "@renderer/components/DeleteModal";

export default function Transcode() {
  const [filePath, setFilePath] = useState(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({
    visible: false,
    path: "",
    params: null,
  });
  const [transcodeList, setTranscodeList] = useState([]);
  const transcodeListRef = useRef(transcodeList);
  const { t } = useTranslation();
  const { pathname } = useLocation();

  // 选择文件
  const selectFile = async (e) => {
    if (e.file.path) {
      setFilePath(e.file.path);
      setShowTypeModal(true);
    }
  };

  // 打开文件夹
  const openFolder = (path) => {
    window.electron.ipcRenderer
      .invoke("WIN_OPEN_FILE", {
        path,
      })
      .then((res) => {
        if (!res) {
          message.error(t("commonText.openFolderError"));
        }
      });
  };

  // 打开文件
  const openFile = (path) => {
    window.electron.ipcRenderer
      .invoke("WIN_OPEN_FILE", {
        path,
      })
      .then((res) => {
        if (!res) {
          message.error(t("commonText.openFileError"));
        }
      });
  };

  // 删除记录
  const deleteData = async ({ path, isDeleteFile }) => {
    console.log(path, isDeleteFile);
    console.log(deleteModalData.params.taskId);
    closeDeleteFileModal();
    const recordDeleteRes = window.electron.ipcRenderer.invoke(
      "QUEUE_STORE_DELETE",
      {
        key: "transcodeList",
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
  const changeTranscodeList = (list) => {
    transcodeListRef.current = list;
    setTranscodeList(list);
  };

  // 转码
  const handleFile = async (outputType) => {
    setShowTypeModal(false);
    const oldFileName = filePath.split("\\").pop().split(".").shift();
    const outputFileName = `${oldFileName}-${new Date().getTime()}.${outputType}`;
    const outputFloaderPath = await window.electron.ipcRenderer.invoke(
      "GET_STORE",
      "defaultOutPath",
    );
    const taskId = nanoid(16);
    const params = {
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
      outputFloaderPath,
      outputFileName,
      outputType,
      createTime: new Date().getTime(),
      progress: 0,
      code: "transcode",
    };
    changeTranscodeList([params, ...(transcodeListRef.current || [])]);
    window.electron.ipcRenderer.send("FFMPEG_COMMAND", params);
    window.electron.ipcRenderer.on(`FFMPEG_PROGRESS_${taskId}`, (e, data) =>
      onProgressChange(e, data, taskId),
    );
  };

  // 转码进度
  const onProgressChange = (e, data, taskId) => {
    changeTranscodeList([
      ...transcodeListRef.current?.map((item) => {
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
    {
      title: t("commonText.text"),
      dataIndex: "inputFilePath",
      key: "inputFilePath",
      width: 200,
    },
    {
      title: t("pages.transcode.transcodeType"),
      dataIndex: "outputType",
      key: "outputType",
      width: 100,
    },
    {
      title: t("commonText.progress"),
      dataIndex: "progress",
      key: "progress",
      width: 100,
      render: (progress) => <Progress percent={progress} />,
    },
    {
      title: t("commonText.createTime"),
      dataIndex: "createTime",
      key: "createTime",
      width: 100,
      render: (createTime: number) => formatTime(createTime),
    },
    {
      title: t("commonText.action"),
      dataIndex: "action",
      key: "action",
      width: 160,
      render: (_, record) => {
        return (
          <>
            <Button
              onClick={() =>
                openFile(
                  `${record.outputFloaderPath}\\${record.outputFileName}`,
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
                  `${record.outputFloaderPath}\\${record.outputFileName}`,
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
      .invoke("GET_STORE", "transcodeList")
      .then((res) => {
        changeTranscodeList(res);
      });
  };

  useEffect(() => {
    if (pathname === ROUTERS.TRANSCODE) {
      init();
    }
  }, [pathname]);
  return (
    <div styleName="transcode">
      <AppSelectFile onSelectFile={selectFile} />
      <Table
        styleName="transcode-table"
        columns={columns}
        dataSource={transcodeList}
        rowKey={"taskId"}
        pagination={{ pageSize: 5, total: transcodeList.length }}
      />
      <TranscodeTypeModal
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
