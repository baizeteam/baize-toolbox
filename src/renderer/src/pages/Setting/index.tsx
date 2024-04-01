import React, { useEffect, useState } from "react";
import { Radio } from "antd";

export default function Setting() {
  const [theme, setTheme] = useState();
  useEffect(() => {
    window.electron.ipcRenderer.invoke("GET_STORE", "theme").then((res) => {
      setTheme(res);
    });
  }, []);
  const onChange = async (e: any) => {
    setTheme(e.target.value);
    await window.electron.ipcRenderer.send(
      "SET_STORE_SEND",
      "theme",
      e.target.value
    );
  };
  return (
    <div className="setting">
      <div>通用设置</div>
      <Radio.Group value={theme} onChange={onChange}>
        <Radio value={"light"}>浅色模式</Radio>
        <Radio value={"dark"}>深色模式</Radio>
        <Radio value={"system"}>跟随系统</Radio>
      </Radio.Group>
    </div>
  );
}
