import React, { useEffect, useState } from "react"
import Theme from "./components/Theme"
import DefaultOutPath from "./components/DefaultOutPath"
import Language from "./components/Language"
import Restore from "./components/Restore"
import AutoLaunch from "./components/AutoLaunch"
import TransformersModels from "./components/TransformersModels"
import "./index.module.less"

export default function Setting() {
  return (
    <div styleName="setting" className="common-content">
      <Language />
      <Theme />
      <AutoLaunch />
      <TransformersModels />
      <DefaultOutPath />
      <Restore />
    </div>
  )
}
