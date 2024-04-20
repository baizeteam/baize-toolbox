import React, { useEffect, useState } from "react";
import { Radio } from "antd";
import { useTranslation } from "react-i18next";
import "./index.module.less";

export default function Theme() {
  const [theme, setTheme] = useState();
  const { t } = useTranslation();

  // 主题切换
  const onThemeChange = async (e) => {
    setTheme(e.target.value);
    await window.ipcInvoke("SET_STORE_RELOAD", {
      key: "theme",
      value: e.target.value,
      code: "THEME",
    });
  };
  useEffect(() => {
    window.ipcInvoke("GET_STORE", "theme").then((res) => {
      setTheme(res);
    });
  }, []);
  return (
    <div styleName="theme">
      <div styleName="block">
        <div styleName="title">{t("siteMain.pages.setting.theme")}</div>
        <Radio.Group value={theme} onChange={onThemeChange}>
          <Radio value={"light"}>
            {t("siteMain.pages.setting.themeOptions.light")}
          </Radio>
          <Radio value={"dark"}>
            {t("siteMain.pages.setting.themeOptions.dark")}
          </Radio>
          <Radio value={"system"}>
            {t("siteMain.pages.setting.themeOptions.system")}
          </Radio>
        </Radio.Group>
      </div>
    </div>
  );
}
