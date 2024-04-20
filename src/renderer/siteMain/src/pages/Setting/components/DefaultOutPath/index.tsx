import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import EllipsisTextControl from "@renderer/components/EllipsisTextControl";
import "./index.module.less";

export default function DefaultOutPath() {
  const [defaultOutPath, setDefaultOutPath] = useState();
  const { t } = useTranslation();
  useEffect(() => {
    window.electron.ipcRenderer
      .invoke("GET_STORE", "defaultOutPath")
      .then((res) => {
        setDefaultOutPath(res);
      });
  }, []);

  // 修改默认存储路径
  const onChangeDefaultOutPath = async () => {
    const res = await window.ipcInvoke("WIN_SELECT_FOLDER");
    if (!res) {
      return;
    }
    const path = res[0];
    setDefaultOutPath(path);
    await window.ipcInvoke("SET_STORE", "defaultOutPath", path);
  };
  return (
    <div styleName="default-out-path">
      <div styleName="block">
        <div styleName="title">{t("siteMain.pages.setting.outputPath")}</div>
        <div styleName="path">
          <div styleName="text">
            <EllipsisTextControl maxWidth={270} content={defaultOutPath} />
          </div>
          <Button
            type="primary"
            styleName="btn"
            onClick={onChangeDefaultOutPath}
          >
            {t("siteMain.pages.setting.change")}
          </Button>
        </div>
      </div>
    </div>
  );
}
