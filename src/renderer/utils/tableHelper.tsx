import EllipsisTextControl from "@renderer/components/EllipsisTextControl";
import { Trans, useTranslation } from "react-i18next";
import { formatTime } from "@renderer/utils/formatTime";
import { Progress, Button } from "antd";
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

// 文本
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

// 打开文件按钮
export const OpenFileBtn = (props) => {
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
export const OpenFolderBtn = (props) => {
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
