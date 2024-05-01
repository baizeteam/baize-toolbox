import React, { useEffect } from "react"
import { lazy, Suspense } from "react"
import { Routes, Route, HashRouter, Navigate } from "react-router-dom"
import AppLoading from "@renderer/components/AppLoading"
import { ROUTERS } from "./ROUTERS"
import Nav from "@siteMain/components/Nav"
import AppHeader from "@siteMain/components/AppHeader"
import KeepAlive from "@renderer/components/KeepAlive"
import "./index.module.less"
import Home from "@siteMain/pages/Home"
import Transcode from "@siteMain/pages/Transcode"
import Extract from "@siteMain/pages/Extract"
import TTS from "@siteMain/pages/TTS"
import Setting from "@siteMain/pages/Setting"
import ScreenRecord from "@siteMain/pages/ScreenRecord"
import ScreenShot from "@siteMain/pages/ScreenShot"
import Compress from "@siteMain/pages/Compress"

// const Home = lazy(() => import("@siteMain/pages/Home"));
// const Transcode = lazy(() => import("@siteMain/pages/Transcode"));
// const Extract = lazy(() => import("@siteMain/pages/Extract"));
// const TTS = lazy(() => import("@siteMain/pages/TTS"));
// const Setting = lazy(() => import("@siteMain/pages/Setting"));
// const ScreenRecord = lazy(() => import("@siteMain/pages/ScreenRecord"));
// const ScreenShot = lazy(() => import("@siteMain/pages/ScreenShot"));
// const Compress = lazy(() => import("@siteMain/pages/Compress"));

export default function BaseRouter() {
  return (
    <HashRouter>
      <Nav />
      <div styleName="container">
        <AppHeader />
        <div styleName="content">
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
      </div>
      {/* <Suspense fallback={<AppLoading />}>
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
            <Route path="*" element={<Navigate to={ROUTERS.HOME} replace />} />
          </Routes>
        </div>
      </Suspense> */}
    </HashRouter>
  )
}
