import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.module.less";
import { Spin } from "antd";
import BaseApp from "@renderer/components/BaseApp";
import { useTranslation } from "react-i18next";

const App = () => {
  const { t } = useTranslation();
  return (
    <BaseApp>
      <div styleName="electron-loading">
        <Spin size="large" />
        <div styleName="tip">{t("siteElectronLoading.tip")}</div>
      </div>
    </BaseApp>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />,
);
