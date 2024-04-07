import React, { useState } from "react";
import { Modal, ModalProps, Radio } from "antd";
import "./index.module.less";

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
  const [value, setValue] = useState<string>("");

  const _handleChange = (e: any) => {
    setValue(e.target.value);
  };

  // 确定
  const _handleOk = () => {
    props.onOk(value);
  };

  return (
    <Modal
      title="请选择转换类型"
      {...props}
      styleName="transcode-type-modal"
      onOk={_handleOk}
    >
      <div>
        <span styleName="label">请选择转换格式</span>
        <Radio.Group onChange={_handleChange}>
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
