import React, { useEffect, useState } from "react"
import { Button, Radio, Select } from "antd"
import Theme from "./components/Theme"
import DefaultOutPath from "./components/DefaultOutPath"
import WhisperModelPath from "./components/WhisperModelPath"
import Language from "./components/Language"
import Restore from "./components/Restore"
import AutoLaunch from "./components/AutoLaunch"
import "./index.module.less"

export default function Setting() {
  return (
    <div styleName="setting" className="common-content">
      <Language />
      <Theme />
      <AutoLaunch />
      <DefaultOutPath />
      <WhisperModelPath />
      <Restore />
    </div>
  )
}
