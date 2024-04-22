import React, { useEffect, useState } from "react";
import "./index.module.less";

export default function ScreenShotWin() {
  const [img, setImg] = useState<string>("");
  useEffect(() => {
    window.ipcOn("GET_SCREEN_SHOT_IMG", (event, data) => {
      console.log(data);
      setImg(data);
    });
  }, []);

  return (
    <div styleName="screen-shot-win">
      <div styleName="mask"></div>
      {img && <img src={img} alt="screenshot" />}
    </div>
  );
}
