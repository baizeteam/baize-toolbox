import React from "react";
import "./index.module.less";
import { Empty } from "antd";
import { useTranslation } from "react-i18next";

export default function AppFunctionDev() {
  const { t } = useTranslation();
  return (
    <div styleName="app-function-dev">
      <Empty description={t("components.appFunctionDev.title")} />
    </div>
  );
}
