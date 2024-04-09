import React, { useEffect } from "react";
import { ConfigProvider, Spin, theme } from "antd";
import "./app.module.less";

import zhCN from "antd/locale/zh_CN";
import BaseRouter from "./router";

export default function App() {
  const [isDark, setIsDark] = React.useState(false);

  useEffect(() => {
    initTheme();
    window.electron.ipcRenderer.on("THEME_CHANGE", initTheme);
  }, []);

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

  const initI18n = async () => {};
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div styleName={`app${isDark ? " is-dark" : " is-light"}`}>
        <BaseRouter />
      </div>
    </ConfigProvider>
  );
}
