import React, { useMemo, useRef, useState } from "react";
import { Button, Table, Progress } from "antd";
import { nanoid } from "nanoid";
import AppSelectFile from "@renderer/components/AppSelectFile";
import TranscodeTypeModal from "./components/TranscodeTypeModal";
import { formatTime } from "@renderer/utils/formatTime";
import "./index.module.less";
import { useTranslation } from "react-i18next";

export default function Transcode() {
  const [filePath, setFilePath] = useState(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [transcodeList, setTranscodeList] = useState([]);
  const transcodeListRef = useRef(transcodeList);
  const { t } = useTranslation();

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
    const outputFileName = `${new Date().getTime()}.${outputType}`;
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
    changeTranscodeList([...(transcodeListRef.current || []), params]);
    window.electron.ipcRenderer.send("FFMPEG_COMMAND", params);
    window.electron.ipcRenderer.on(`FFMPEG_PROGRESS_${taskId}`, (e, data) => {
      console.log(transcodeListRef.current);
      changeTranscodeList([
        ...transcodeListRef.current?.map((item) => {
          if (item?.taskId === taskId) {
            item.progress = data.progress;
          }
          return item;
        }),
      ]);
      console.log(data);
    });
  };
  return (
    <div styleName="transcode">
      <AppSelectFile onSelectFile={selectFile} />
      <TranscodeTypeModal
        open={showTypeModal}
        onCancel={() => setShowTypeModal(false)}
        onOk={handleFile}
      />
      <Table
        styleName="transcode-table"
        columns={columns}
        dataSource={transcodeList}
        rowKey={"taskId"}
      />
    </div>
  );
}
