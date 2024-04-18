import React, { useState, useEffect } from "react";
import { Modal, ModalProps, Radio } from "antd";
import "./index.module.less";
import { useTranslation } from "react-i18next";
import AppLoading from "@renderer/components/AppLoading";

const options = [
  { label: "提取视频", value: "mp4" },
  { label: "提取音频", value: "mp3" },
];

interface ITypeModalProps extends Omit<ModalProps, "onOk"> {
  filePath: string;
  onOk: (value: string) => void;
}

export default function TypeModal(props: ITypeModalProps) {
  const { filePath, onOk, open } = props;
  const [value, setValue] = useState<string>(options[0].value);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileInfo, setFileInfo] = useState<any>();
  const { t } = useTranslation();

  useEffect(() => {
    init();
  }, [open]);

  const init = async () => {
    if (filePath && open) {
      setLoading(true);
      const res = await window.electron.ipcRenderer.invoke(
        "FFMPEG_GET_VIDEO_INFO",
        { filePath },
      );
      console.log(res);
      setFileInfo(res);
      setLoading(false);
    }
  };

  const _handleChange = (e: any) => {
    setValue(e.target.value);
  };

  // 确定
  const _handleOk = () => {
    onOk(value);
  };

  return (
    <Modal
      title={t("siteMain.pages.compress.typeModal.title")}
      {...props}
      onOk={_handleOk}
    >
      <div>
        {loading ? (
          <AppLoading />
        ) : (
          <div>
            <div>比特率:{fileInfo?.bitrate}</div>
            <div>时长:{fileInfo?.duration}</div>
            <div>
              视频尺寸:{fileInfo?.resolution?.width}x
              {fileInfo?.resolution?.height}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
