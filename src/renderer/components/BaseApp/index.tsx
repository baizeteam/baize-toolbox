import React, { useEffect } from "react"
import { ConfigProvider, message, Spin, theme } from "antd"
import "./app.module.less"

import i18n, { antdLocale } from "@renderer/i18n"

message.config({
  top: 60,
  duration: 2,
  maxCount: 3,
  rtl: true,
})

export default function App(props) {
  const { children, showBgColor, ...rest } = props
  const [isDark, setIsDark] = React.useState(false)
  const [i18nCur, setI18nCur] = React.useState("")

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    initTheme()
    initI18n()
  }

  // 初始化主题
  const initTheme = async () => {
    const themeRes = await window.ipcInvoke("GET_STORE", "theme")
    if (themeRes === "dark") {
      changeIsDark(true)
    } else if (themeRes === "light") {
      changeIsDark(false)
    } else {
      if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        // 检测到暗色主题
        changeIsDark(true)
      } else {
        // 检测到亮色主题
        changeIsDark(false)
      }
    }
  }

  const changeIsDark = (isDark) => {
    setIsDark(isDark)
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }

  // 初始化国际化
  const initI18n = async () => {
    const i18nRes = await window.ipcInvoke("GET_STORE", "i18n")
    i18n.changeLanguage(i18nRes)
    setI18nCur(i18nRes)
  }
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
      locale={antdLocale[i18nCur]}
    >
      <div
        styleName="app"
        className={`${isDark ? "is-dark" : "is-light"}`}
        style={{ background: isDark && showBgColor && "rgba(0,0,0)" }}
        {...rest}
      >
        {children}
      </div>
    </ConfigProvider>
  )
}
