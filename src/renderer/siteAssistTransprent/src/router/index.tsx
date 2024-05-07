import React, { useEffect } from "react"
import { lazy, Suspense } from "react"
import { Routes, Route, HashRouter, useNavigate } from "react-router-dom"
import { ROUTERS } from "./ROUTERS"
import "./index.module.less"

const RecordWin = lazy(() => import("@siteAssistTransprent/pages/RecordWin"))
const ScreenShotWin = lazy(() => import("@siteAssistTransprent/pages/ScreenShotWin"))
const ImageWin = lazy(() => import("@siteAssistTransprent/pages/ImageWin"))

export default function BaseRouter() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  )
}

const App = () => {
  const navigate = useNavigate()
  useEffect(() => {
    window.ipcOn("INIT_ROUTE", (e, data) => {
      console.log("INIT_ROUTE", e, data)
      navigate(data)
    })
  }, [])
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route path={"/"}>
          <Route path={ROUTERS.RECODE_WIN} element={<RecordWin />} />
          <Route path={ROUTERS.SCREEN_SHOT_WIN} element={<ScreenShotWin />} />
          <Route path={ROUTERS.IMAGE_WIN} element={<ImageWin />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
