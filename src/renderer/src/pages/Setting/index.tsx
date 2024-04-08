import React, { useEffect, useState } from "react";
import { Button, Radio } from "antd";
import "./index.module.less";

export default function Setting() {
  const [theme, setTheme] = useState();
  const [defaultOutPath, setDefaultOutPath] = useState();
  useEffect(() => {
    init();
  }, []);

  // 初始化
  const init = () => {
    window.electron.ipcRenderer.invoke("GET_STORE", "theme").then((res) => {
      setTheme(res);
    });
    window.electron.ipcRenderer
      .invoke("GET_STORE", "defaultOutPath")
      .then((res) => {
        setDefaultOutPath(res);
      });
  };

  // 主题切换
  const onThemeChange = async (e) => {
    setTheme(e.target.value);
    await window.electron.ipcRenderer.send(
      "SET_STORE_SEND",
      "theme",
      e.target.value
    );
  };

  // 修改默认存储路径
  const onChangeDefaultOutPath = async () => {
    const res = await window.electron.ipcRenderer.invoke("WIN_SELECT_FOLDER");
    if (!res) {
      return;
    }
    const path = res[0];
    setDefaultOutPath(path);
    await window.electron.ipcRenderer.invoke(
      "SET_STORE",
      "defaultOutPath",
      path
    );
  };

  return (
    <div styleName="setting">
      <div styleName="block">
        <div styleName="title">主题</div>
        <Radio.Group value={theme} onChange={onThemeChange}>
          <Radio value={"light"}>浅色模式</Radio>
          <Radio value={"dark"}>深色模式</Radio>
          <Radio value={"system"}>跟随系统</Radio>
        </Radio.Group>
      </div>
      <div styleName="block">
        <div styleName="title">默认存储路径</div>
        <div styleName="default-out-path">
          <div styleName="text">{defaultOutPath}</div>
          <Button
            type="primary"
            styleName="btn"
            onClick={onChangeDefaultOutPath}
          >
            修改
          </Button>
        </div>
      </div>
    </div>
  );
}
