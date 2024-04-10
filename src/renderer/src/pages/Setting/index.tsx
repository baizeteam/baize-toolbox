import React, { useEffect, useState } from "react";
import { Button, Radio, Select } from "antd";
import Theme from "./components/Theme";
import DefaultOutPath from "./components/DefaultOutPath";
import Language from "./components/Language";
import "./index.module.less";

export default function Setting() {
  return (
    <div styleName="setting" className="common-content">
      <Language />
      <Theme />
      <DefaultOutPath />
    </div>
  );
}
