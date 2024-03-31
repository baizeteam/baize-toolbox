import React, { useEffect } from "react";
import { lazy, Suspense } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";

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
    window.electron.ipcRenderer.on("MAIN_LOG", (e, data) => {
      console.log("main log", data);
    });
  }, []);

  // 初始化主题
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
      <HashRouter>
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
      </HashRouter>
    </ConfigProvider>
  );
}
