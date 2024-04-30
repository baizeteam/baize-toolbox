import React, { useEffect } from "react"
import { lazy, Suspense } from "react"
import { Routes, Route, HashRouter, Navigate } from "react-router-dom"
import { ROUTERS } from "./ROUTERS"
import "./index.module.less"

export default function BaseRouter() {
  return (
    <HashRouter>
      <Suspense fallback={<></>}>
        <Routes>
          <Route path={"/"}></Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
