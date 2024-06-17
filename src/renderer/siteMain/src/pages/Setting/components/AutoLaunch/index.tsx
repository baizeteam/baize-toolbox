import { useState, useEffect, useCallback } from "react"
import { Select } from "antd"
import { useTranslation } from "react-i18next"
import "./index.module.less"

export default function AutoLaunch() {
  const [isAutoLaunch, setIsAutoLaunch] = useState("false")
  const { t } = useTranslation()

  const options = [
    { value: "true", label: t("siteMain.pages.setting.autoLaunchOption.yes") },
    { value: "false", label: t("siteMain.pages.setting.autoLaunchOption.no") },
  ]

  const onChange = async (e) => {
    setIsAutoLaunch(e)
    window.ipcInvoke("SET_STORE", "isAutoLaunch", e)
    window.ipcInvoke("SET_AUTO_LAUNCH", e)
  }

  useEffect(() => {
    window.ipcInvoke("GET_STORE", "isAutoLaunch").then((res) => {
      setIsAutoLaunch(res)
      window.ipcInvoke("SET_AUTO_LAUNCH", res)
    })
  }, [])

  return (
    <div styleName="auto-launch">
      <div styleName="title">{t("siteMain.pages.setting.autoLaunch")}</div>
      <Select options={options} style={{ width: 120 }} value={isAutoLaunch} onChange={onChange} />
    </div>
  )
}
