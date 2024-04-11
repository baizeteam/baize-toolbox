import React, { useEffect } from "react";
import { lazy, Suspense } from "react";
import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import { ROUTERS } from "./ROUTERS";
import { Spin } from "antd";
import "./index.module.less";

const ElectronLoading = lazy(() => import("@siteAssist/pages/ElectronLoading"));

export default function BaseRouter() {
  return (
    <div style={{ width: 100, height: 100, background: "red" }}>
      <Spin />
    </div>

    // <HashRouter>
    //   <Suspense fallback={<Spin />}>
    //     <Routes>
    //       <Route path={"/"}>
    //         <Route
    //           path={ROUTERS.ElectronLoading}
    //           element={<ElectronLoading />}
    //         />
    //       </Route>
    //     </Routes>
    //   </Suspense>
    // </HashRouter>
  );
}
