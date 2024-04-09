import React, { useEffect } from "react";
import { lazy, Suspense } from "react";
import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import { ROUTERS } from "./ROUTERS";
import { Spin } from "antd";
import Nav from "@renderer/components/Nav";
import KeepAlive from "@renderer/components/KeepAlive";
import "./index.module.less";

const Home = lazy(() => import("@renderer/pages/Home"));
const Transcode = lazy(() => import("@renderer/pages/Transcode"));
const Extract = lazy(() => import("@renderer/pages/Extract"));
const TTS = lazy(() => import("@renderer/pages/TTS"));
const Setting = lazy(() => import("@renderer/pages/Setting"));
const ScreenRecord = lazy(() => import("@renderer/pages/ScreenRecord"));
const ScreenShot = lazy(() => import("@renderer/pages/ScreenShot"));
const Compress = lazy(() => import("@renderer/pages/Compress"));

export default function BaseRouter() {
  return (
    <HashRouter>
      <Nav />
      <Suspense fallback={<Spin />}>
        <div styleName="container">
          <Routes>
            <Route path={"/"} element={<KeepAlive />}>
              <Route path={ROUTERS.HOME} element={<Home />} />
              <Route path={ROUTERS.TRANSCODE} element={<Transcode />} />
              <Route path={ROUTERS.EXTRACT} element={<Extract />} />
              <Route path={ROUTERS.TTS} element={<TTS />} />
              <Route path={ROUTERS.SCREEN_RECORD} element={<ScreenRecord />} />
              <Route path={ROUTERS.SCREEN_SHOT} element={<ScreenShot />} />
              <Route path={ROUTERS.SETTING} element={<Setting />} />
              <Route path={ROUTERS.COMPRESS} element={<Compress />} />
            </Route>
            {/* 通配符路由处理不匹配的情况 */}
            <Route path="*" element={<Navigate to={ROUTERS.HOME} replace />} />
          </Routes>
        </div>
      </Suspense>
    </HashRouter>
  );
}
