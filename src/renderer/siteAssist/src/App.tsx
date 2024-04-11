import React, { useEffect } from "react";
import { ConfigProvider, Spin, theme } from "antd";
import "./app.module.less";

import BaseRouter from "./router";
import i18n, { antdLocale } from "@renderer/i18n";

export default function App() {
  const [isDark, setIsDark] = React.useState(false);
  const [i18nCur, setI18nCur] = React.useState("");

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    initTheme();
    initI18n();
  };

  // 初始化主题
  const initTheme = async () => {
    const themeRes = await window.electron.ipcRenderer.invoke(
      "GET_STORE",
      "theme",
    );
    if (themeRes === "dark") {
      setIsDark(true);
    } else if (themeRes === "light") {
      setIsDark(false);
    } else {
      if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        // 检测到暗色主题
        setIsDark(true);
      } else {
        // 检测到亮色主题
        setIsDark(false);
      }
    }
  };

  // 初始化国际化
  const initI18n = async () => {
    const i18nRes = await window.electron.ipcRenderer.invoke(
      "GET_STORE",
      "i18n",
    );
    i18n.changeLanguage(i18nRes);
    setI18nCur(i18nRes);
  };
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
      locale={antdLocale[i18nCur]}
    >
      <div styleName={`app${isDark ? " is-dark" : " is-light"}`}>
        <BaseRouter />
      </div>
    </ConfigProvider>
  );
}
