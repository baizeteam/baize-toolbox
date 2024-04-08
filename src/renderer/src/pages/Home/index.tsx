import React from "react";
import "./index.module.less";
import appIcon from "@renderer/assets/icon.ico";

function App() {
  return (
    <div styleName="home">
      <img
        styleName="img"
        onClick={() => window.open("https://github.com/sulgweb/baize-box")}
        src={appIcon}
      />

      <div styleName="title">白泽工具箱</div>
      <div styleName="desc">
        白泽工具箱是一款功能强大的工具，可以帮助用户在不同的多媒体格式之间进行快速、高效的转换。无论是图片、音频还是视频，这个工具都能轻松搞定，让用户在处理多媒体文件时更加方便快捷。
      </div>
    </div>
  );
}

export default App;
