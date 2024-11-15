import React from "react"
import "./index.module.less"
import { Empty } from "antd"
import { useTranslation } from "react-i18next"
import BlankSvg from "./blank.svg"

export default function AppFunctionDev() {
  const { t } = useTranslation()
  return (
    <div styleName="app-function-dev">
      <Empty description={t("translation:siteMain.components.appFunctionDev.title")} image={BlankSvg} />
    </div>
  )
}
