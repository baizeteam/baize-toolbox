import React, { useState } from "react";
import { Modal, ModalProps, Radio } from "antd";
import "./index.module.less";
import { useTranslation } from "react-i18next";

const VideoList = [
  { label: "MP4", value: "mp4" },
  { label: "MKV", value: "mkv" },
  { label: "FLV", value: "flv" },
  { label: "AVI", value: "avi" },
  { label: "WMV", value: "wmv" },
  { label: "MOV", value: "mov" },
  { label: "3GP", value: "3gp" },
  // { label: "OGG", value: "ogg" },
];

interface ITranscodeTypeModalProps extends Omit<ModalProps, "onOk"> {
  onOk: (value: string) => void;
}

export default function TranscodeTypeModal(props: ITranscodeTypeModalProps) {
  const [value, setValue] = useState<string>(VideoList[0].value);
  const { t } = useTranslation();

  const _handleChange = (e: any) => {
    setValue(e.target.value);
  };

  // 确定
  const _handleOk = () => {
    props.onOk(value);
  };

  return (
    <Modal
      title={t("pages.transcode.transcodeTypeModal.title")}
      {...props}
      styleName="transcode-type-modal"
      onOk={_handleOk}
    >
      <div>
        <Radio.Group value={value} onChange={_handleChange}>
          {VideoList.map((item) => (
            <Radio value={item.value} key={item.value}>
              {item.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    </Modal>
  );
}
