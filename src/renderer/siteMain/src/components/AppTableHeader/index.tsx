import React from "react"
import "./index.module.less"
import { useTranslation } from "react-i18next"
import AppIcon from "@renderer/components/AppIcon"
import { Modal, message } from "antd"

interface IAppTableHeaderProps {
  title: string
  valueKey: string
  onClean: () => void
}

export default function AppTableHeader(props: IAppTableHeaderProps) {
  const { title, valueKey, onClean } = props
  const { t } = useTranslation()

  const handleClean = () => {
    const modal = Modal.confirm({
      title: t("commonText.clean"),
      content: t("commonText.clean") + t("commonText.interval") + t(title),
      onOk(e) {
        window.electron.ipcRenderer.invoke("RESET_STORE_BY_KEY", valueKey).then(() => {
          message.success(t("commonText.success"))
          onClean()
          modal.destroy()
        })
      }
    })
  }

  return (
    <div styleName="app-table-header">
      <div styleName="title">{t(title)}</div>
      <div styleName="delete-btn" onClick={handleClean}>
        <div styleName="text">{t("commonText.clean")}</div>
        <AppIcon icon="#baize-shanchu" />
      </div>
    </div>
  )
}
