import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, UploadProps } from "antd";
import { useTranslation } from "react-i18next";
import "./index.module.less";

const { Dragger } = Upload;

interface IAppSelectFileProps extends UploadProps {
  onSelectFile: (value: any) => void;
}

export default function AppSelectFile(props: IAppSelectFileProps) {
  const { onSelectFile } = props;
  const { t } = useTranslation();
  return (
    <div styleName="app-select-file">
      <Dragger {...props} customRequest={onSelectFile} showUploadList={false}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t("components.appSelectFile.title")}</p>
      </Dragger>
    </div>
  );
}
