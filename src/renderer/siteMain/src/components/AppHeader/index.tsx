import React, { useEffect, useState } from "react";
import "./index.module.less";
import AppIcon from "@renderer/components/AppIcon";

export default function AppHeader() {
  const [isMaximized, setIsMaximized] = useState(false);

  // 变更窗口最大化状态
  const handleWinMaximize = async () => {
    await window.electron.ipcRenderer.invoke("WIN_MAXIMIZE");
    setIsMaximized((pre) => !pre);
  };
  // 初始化
  const init = async () => {
    const res = await window.electron.ipcRenderer.invoke(
      "WIN_GET_MAXIMIZED_STATE",
    );
    setIsMaximized(res);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div styleName="app-header">
      <AppIcon
        icon="#baize-zuixiaohua"
        onClick={() => {
          window.electron.ipcRenderer.send("WIN_MINIMIZE");
        }}
      />
      <AppIcon
        icon={isMaximized ? "#baize-zuidahua" : "#baize-zuidahua1"}
        onClick={handleWinMaximize}
      />
      <AppIcon
        icon="#baize-guanbi"
        onClick={() => {
          window.electron.ipcRenderer.send("WIN_CLOSE");
        }}
      />
    </div>
  );
}
