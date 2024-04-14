import React, { useRef, useState } from "react";
import EllipsisTextControl from "@renderer/components/EllipsisTextControl";
import { Trans, useTranslation } from "react-i18next";
import { formatTime } from "@renderer/utils/formatTime";
import { Progress, Button, Modal, Checkbox, message } from "antd";
import { openFile, openFolder, separator } from "@renderer/utils/fileHelper";

// 文本
export const tableText = {
  title: <Trans i18nKey="commonText.text" />,
  dataIndex: "text",
  key: "text",
  width: 400,
  render: (text) => (
    <EllipsisTextControl content={text} width={360} type="single" />
  ),
};

// 文件
export const tableFile = {
  title: <Trans i18nKey="commonText.file" />,
  dataIndex: "outputFileName",
  key: "outputFileName",
  width: 400,
  render: (text) => (
    <EllipsisTextControl content={text} width={360} type="single" />
  ),
};

// 源文件
export const tableOriginFile = {
  title: <Trans i18nKey="commonText.originFile" />,
  dataIndex: "inputFilePath",
  key: "inputFilePath",
  width: 240,
  render: (inputFilePath) => (
    <EllipsisTextControl content={inputFilePath} width={200} type="single" />
  ),
};

//
export const tableFps = {
  title: <Trans i18nKey="commonText.fps" />,
  dataIndex: "fps",
  key: "fps",
  width: 60,
};

// 进度
export const tableProgress = {
  title: <Trans i18nKey="commonText.progress" />,
  dataIndex: "progress",
  key: "progress",
  render: (progress) => <Progress percent={progress} />,
};

// 创建时间
export const tableCreateTime = {
  title: <Trans i18nKey="commonText.createTime" />,
  dataIndex: "createTime",
  key: "createTime",
  width: 160,
  render: (createTime: number) => formatTime(createTime),
};

interface ITableBtnProps {
  record: any;
  hasFile?: boolean;
  callback?: () => void;
}

// 打开文件按钮
export const OpenFileBtn = (props: ITableBtnProps) => {
  const { record } = props;
  const { t } = useTranslation();
  return (
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
  );
};

// 打开文件夹按钮
export const OpenFolderBtn = (props: ITableBtnProps) => {
  const { record } = props;
  const { t } = useTranslation();
  return (
    <Button
      onClick={() => openFolder(record.outputFloaderPath)}
      type="link"
      className="common-table-link-btn"
    >
      {t("commonText.openFolder")}
    </Button>
  );
};

// 删除按钮
export const DeleteRecordBtn = (props: ITableBtnProps) => {
  const { record, hasFile, callback } = props;
  const isCheckRef = useRef(true);

  const { t } = useTranslation();

  // 选择是否删除文件
  const onCheckBoxChnage = (e) => {
    isCheckRef.current = e.target.checked;
  };

  // 删除记录
  const deleteData = async ({ record, isDeleteFile }) => {
    const recordDeleteRes = window.electron.ipcRenderer.invoke(
      "QUEUE_STORE_DELETE",
      {
        key: `${record.code}List`,
        idKey: "taskId",
        id: record.taskId,
      },
    );
    if (isDeleteFile) {
      const path = `${record.outputFloaderPath}${separator}${record.outputFileName}`;
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
    callback();
  };

  // 删除按钮点击事件, 弹出确认框
  const onDelete = (record) => {
    Modal.confirm({
      title: t("siteMain.components.deleteModal.content"),
      content: hasFile ? (
        <Checkbox defaultChecked onChange={onCheckBoxChnage}>
          {t("siteMain.components.deleteModal.deleteFileText")}
        </Checkbox>
      ) : null,
      onOk: () => {
        deleteData({ record, isDeleteFile: isCheckRef.current });
      },
    });
  };
  return (
    <Button
      onClick={() => onDelete(record)}
      type="link"
      className="common-table-link-btn"
    >
      {t("commonText.delete")}
    </Button>
  );
};
