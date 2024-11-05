import { Button } from "antd"
import React from "react"
import { nanoid } from "nanoid"
import AppInput from "../../components/AppInput"

export default function Chat() {
  const loadModel = () => {
    window.ipcSend("CHAT_LOAD")
  }

  const generate = () => {
    const messages = [
      {
        id: nanoid(8),
        role: "user",
        content: "你好呀",
      },
    ]
    window.ipcSend("CHAT_GENERATE", {
      messages,
    })
  }

  const loadWhisper = () => {
    window.ipcSend("WHISPER_LOAD")
  }

  return (
    <div>
      <div>chat</div>
      <AppInput />
      <Button onClick={loadModel}>加载模型</Button>
      <Button onClick={generate}>生成</Button>
      <Button onClick={loadWhisper}>加载whisper</Button>
    </div>
  )
}
