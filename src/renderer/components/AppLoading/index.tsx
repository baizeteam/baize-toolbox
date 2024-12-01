import React from "react"
import { Spin } from "antd"
import "./index.module.less"
import { useTranslation } from "react-i18next"

export default function AppLoading() {
  const { t } = useTranslation()
  return (
    <div styleName="app-loading">
      <Spin size="large" />
      <div styleName="tip">{t("translation:commonText.loading")}</div>
    </div>
  )
}
