import React, { useEffect, useState } from "react"
import { Select, message } from "antd"
import { useTranslation } from "react-i18next"
import "./index.module.less"

const options = [
  { value: "zhCN", label: "中文" },
  { value: "enUS", label: "English" },
]

export default function Language() {
  const [language, setLanguage] = useState(null)
  const { t } = useTranslation()
  const onChange = async (e) => {
    setLanguage(e)
    await window.ipcInvoke("SET_STORE_RELOAD", {
      key: "i18n",
      value: e,
      code: "I18N",
    })
  }

  useEffect(() => {
    window.ipcInvoke("GET_STORE", "i18n").then((res) => {
      setLanguage(res)
    })
  }, [])
  return (
    <div styleName="language">
      <div styleName="block">
        <div styleName="title">{t("siteMain.pages.setting.language")}</div>
        <Select options={options} style={{ width: 120 }} value={language} onChange={onChange} />
      </div>
    </div>
  )
}
