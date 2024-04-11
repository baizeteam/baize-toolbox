import EllipsisTextControl from "@siteMain/components/EllipsisTextControl";
import i18n from "@renderer/i18n";
import { formatTime } from "@siteMain/utils/formatTime";
import { Progress } from "antd";

// 文本
export const tableText = {
  title: i18n.t("commonText.text"),
  dataIndex: "text",
  key: "text",
  width: 400,
  render: (text) => (
    <EllipsisTextControl content={text} width={360} type="single" />
  ),
};

// 源文件
export const tableOriginFile = {
  title: i18n.t("commonText.originFile"),
  dataIndex: "inputFilePath",
  key: "inputFilePath",
  width: 240,
  render: (inputFilePath) => (
    <EllipsisTextControl content={inputFilePath} width={200} type="single" />
  ),
};

// 进度
export const tableProgress = {
  title: i18n.t("commonText.progress"),
  dataIndex: "progress",
  key: "progress",
  render: (progress) => <Progress percent={progress} />,
};

// 创建时间
export const tableCreateTime = {
  title: i18n.t("commonText.createTime"),
  dataIndex: "createTime",
  key: "createTime",
  width: 160,
  render: (createTime: number) => formatTime(createTime),
};
