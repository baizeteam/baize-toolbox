import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, UploadProps } from "antd";
import "./index.module.less";

const { Dragger } = Upload;

interface IAppSelectFileProps extends UploadProps {
  onSelectFile: (value: any) => void;
}

export default function AppSelectFile(props: IAppSelectFileProps) {
  const { onSelectFile } = props;
  return (
    <Dragger
      styleName="app-select-file"
      {...props}
      customRequest={onSelectFile}
      showUploadList={false}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">选择或拖动文件到此区域进行上传</p>
    </Dragger>
  );
}
