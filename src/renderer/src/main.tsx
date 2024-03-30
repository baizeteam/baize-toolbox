import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import BaseRouter from "./router";
import "./index.module.less";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BaseRouter />
);
