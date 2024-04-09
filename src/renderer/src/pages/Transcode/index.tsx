import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Progress } from "antd";
import { nanoid } from "nanoid";
import AppSelectFile from "@renderer/components/AppSelectFile";
import TranscodeTypeModal from "./components/TranscodeTypeModal";
import { formatTime } from "@renderer/utils/formatTime";
import "./index.module.less";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { ROUTERS } from "@renderer/router/ROUTERS";

export default function Transcode() {
  const [filePath, setFilePath] = useState(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
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
      width: 100,
      render: (_, record) => {
        return (
          <Button
            onClick={() => {
              console.log(record, record.outputFloaderPath);
              window.electron.ipcRenderer.send("WIN_OPEN_FOLDER", {
                path: record.outputFloaderPath,
              });
            }}
            type="link"
            style={{ padding: 0 }}
          >
            {t("commonText.openFolder")}
          </Button>
        );
      },
    },
  ];

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
      creatTime: new Date().getTime(),
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

  useEffect(() => {
    if (pathname === ROUTERS.TRANSCODE) {
      window.electron.ipcRenderer
        .invoke("GET_STORE", "transcodeList")
        .then((res) => {
          changeTranscodeList(res);
        });
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
    </div>
  );
}
