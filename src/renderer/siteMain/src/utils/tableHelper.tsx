import EllipsisTextControl from "@siteMain/components/EllipsisTextControl";
import { Trans } from "react-i18next";
import { formatTime } from "@siteMain/utils/formatTime";
import { Progress } from "antd";

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
