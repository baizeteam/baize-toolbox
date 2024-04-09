import React from "react";
import "./index.module.less";
import appIcon from "@renderer/assets/icon.ico";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();
  return (
    <div styleName="home">
      <img
        styleName="img"
        onClick={() => window.open("https://github.com/sulgweb/baize-box")}
        src={appIcon}
      />

      <div styleName="title">{t("pages.home.title")}</div>
      <div styleName="desc">{t("pages.home.desc")}</div>
    </div>
  );
}

export default App;
