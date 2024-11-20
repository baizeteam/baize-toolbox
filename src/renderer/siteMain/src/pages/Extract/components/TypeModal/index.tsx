import React, { useEffect, useState } from "react"
import { Modal, ModalProps, Radio } from "antd"
import "./index.module.less"
import { useTranslation } from "react-i18next"

const options = [
  { label: "提取视频", value: "mp4" },
  { label: "提取音频", value: "mp3" },
  { label: "提取字幕", value: "text" },
]

interface ITypeModalProps extends Omit<ModalProps, "onOk"> {
  onOk: (value: string) => void
}

export default function TypeModal(props: ITypeModalProps) {
  const { open } = props
  const [value, setValue] = useState<string>(options[0].value)
  const [hasWhisper, setHasWhisper] = useState<Boolean>(false)
  const { t } = useTranslation()

  useEffect(() => {
    window.ipcInvoke("GET_STORE", "whisperModelPath").then((res) => {
      setHasWhisper(!!res)
    })
  }, [open])

  const _handleChange = (e: any) => {
    setValue(e.target.value)
  }

  // 确定
  const _handleOk = () => {
    props.onOk(value)
  }

  return (
    <Modal title={t("translation:siteMain.pages.extract.typeModal.title")} {...props} onOk={_handleOk}>
      <div>
        <Radio.Group value={value} onChange={_handleChange}>
          {options.map((item) => (
            <Radio value={item.value} key={item.value} disabled={item.value === "text" && !hasWhisper}>
              {item.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    </Modal>
  )
}
