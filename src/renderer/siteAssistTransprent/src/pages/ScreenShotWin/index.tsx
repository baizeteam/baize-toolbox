import React, { useEffect, useRef, useState } from "react"
import "./index.module.less"
import ScreenShot from "js-web-screen-shot"
import { nanoid } from "nanoid"

const getStream = (source): Promise<MediaStream | null> => {
  return new Promise((resolve, _reject) => {
    // 获取指定窗口的媒体流
    // 此处遵循的是webRTC的接口类型  暂时TS类型没有支持  只能断言成any
    ;(navigator.mediaDevices as any)
      .getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: source.id,
          },
        },
      })
      .then((stream: MediaStream) => {
        resolve(stream)
      })
      .catch((error: any) => {
        console.log(error)
        resolve(null)
      })
  })
}

const handleCompleteBack = (e, display) => {
  const taskId = nanoid(16)
  const params = {
    taskId,
    createTime: new Date().getTime(),
    code: "screenShot",
    ...e,
    display,
  }
  window.ipcInvoke("SCREEN_SHOT_COMPLETE", params)
}

export default function ScreenShotWin() {
  const screenShotRef = useRef<ScreenShot | null>(null)
  useEffect(() => {
    window.ipcOn("GET_SCREEN_SHOT_STREAM", async (event, data) => {
      const { display, source } = data
      const stream = await getStream(source)
      screenShotRef.current = new ScreenShot({
        enableWebRtc: true, // 启用webrtc
        screenFlow: stream!, // 传入屏幕流数据
        level: 999,
        completeCallback: (e) => {
          handleCompleteBack(e, display)
        },
        closeCallback: () => {
          window.ipcInvoke("SCREEN_SHOT_WIN_HIDE")
        },
      })
    })
  }, [])

  return <div styleName="screen-shot-win"></div>
}
