import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import "./index.module.less"
import BaseApp from "@renderer/components/BaseApp"
import BaseRouter from "@siteAssistTransprent/router"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BaseApp>
    <BaseRouter />
  </BaseApp>
)
