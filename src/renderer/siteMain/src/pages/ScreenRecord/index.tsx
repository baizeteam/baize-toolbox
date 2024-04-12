import React from "react";
import AppFunctionDev from "@siteMain/components/AppFuctionDev";
import { Button } from "antd";

export default function ScreenRecord() {
  const openScreenRecordWin = () => {
    window.electron.ipcRenderer.send("OPEN_RECORD_WIN");
  };
  return (
    <div>
      {/* <AppFunctionDev /> */}
      <Button onClick={openScreenRecordWin}>ScreenRecord</Button>
    </div>
  );
}
