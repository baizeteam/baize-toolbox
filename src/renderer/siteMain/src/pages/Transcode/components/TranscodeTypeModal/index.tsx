import React, { useState } from "react"
import { Modal, ModalProps, Radio } from "antd"
import "./index.module.less"
import { useTranslation } from "react-i18next"
import { fileSelectAccetps } from "@renderer/utils/fileHelper"

const options = [...fileSelectAccetps.video, ...fileSelectAccetps.audio].map((item) => ({
  label: item.toUpperCase(),
  value: item
}))

interface ITranscodeTypeModalProps extends Omit<ModalProps, "onOk"> {
  onOk: (value: string) => void
}

export default function TranscodeTypeModal(props: ITranscodeTypeModalProps) {
  const [value, setValue] = useState<string>(options[0].value)
  const { t } = useTranslation()

  const _handleChange = (e: any) => {
    setValue(e.target.value)
  }

  // 确定
  const _handleOk = () => {
    props.onOk(value)
  }

  return (
    <Modal title={t("siteMain.pages.transcode.typeModal.title")} {...props} onOk={_handleOk}>
      <div>
        <Radio.Group value={value} onChange={_handleChange}>
          {options.map((item) => (
            <Radio value={item.value} key={item.value}>
              {item.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    </Modal>
  )
}
