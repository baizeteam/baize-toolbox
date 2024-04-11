import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.module.less";
import { Spin } from "antd";
import i18n from "@renderer/i18n";
import BaseApp from "@renderer/components/BaseApp";

const App = () => {
  return (
    <BaseApp style={{ background: "rgba(0,0,0,0)" }}>
      <div styleName="electron-loading">
        <Spin size="large" />
        <div styleName="tip">{i18n.t("siteElectronLoading.tip")}</div>
      </div>
    </BaseApp>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />,
);
