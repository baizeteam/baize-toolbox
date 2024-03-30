import React, { useEffect } from "react";
import { lazy, Suspense } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { ROUTERS } from "./ROUTERS";
import { ConfigProvider, Spin, theme } from "antd";
import Nav from "@renderer/components/Nav";
import "./index.module.less";

const Setting = lazy(() => import("@renderer/pages/Setting"));
const Home = lazy(() => import("@renderer/pages/Home"));
const Translate = lazy(() => import("@renderer/pages/Translate"));

export default function BaseRouter() {
  const [isDark, setIsDark] = React.useState(false);
  useEffect(() => {
    initTheme();
    window.electron.ipcRenderer.on("THEME_CHANGE", initTheme);
  }, []);

  // 初始化
  const initTheme = async () => {
    const themeRes = await window.api.getStore("theme");
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

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <div styleName={`app${isDark ? " is-dark" : " is-light"}`}>
          <Nav />
          <Suspense fallback={<Spin />}>
            <Routes>
              <Route path={ROUTERS.HOME} element={<Home />} />
              <Route path={ROUTERS.SETTING} element={<Setting />} />
              <Route path={ROUTERS.TRANSCODE} element={<Translate />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ConfigProvider>
  );
}
