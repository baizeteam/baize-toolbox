import { Button, message } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { nanoid } from "nanoid"
import AppChatInput from "../../components/AppChatInput"
import AppChatList from "../../components/AppChatList"
import { cloneDeep } from "lodash"
import { MessageOutlined } from "@ant-design/icons"
import { separator } from "@renderer/utils/fileHelper"
import "./index.module.less"

interface MessageItem {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function Chat() {
  const workerRef = useRef<Worker | null>(null)
  const [messageList, setMessageList] = useState<MessageItem[]>([
    // {
    //   id: nanoid(8),
    //   role: "user",
    //   content: "111111111111111111111111111111111111111111111111111111111111111111111111",
    // },
    // {
    //   id: nanoid(8),
    //   role: "assistant",
    //   content: "222",
    // },
  ])
  const [isChat, setIsChat] = useState(false)

  const messageListRef = useRef<MessageItem[]>(messageList)

  const loadModel = () => {
    workerRef.current?.postMessage({ type: "load" })
  }

  const changeMessageList = (list) => {
    messageListRef.current = list
    setMessageList(list)
  }

  const sendMessage = (value: string) => {
    const message: MessageItem = {
      id: nanoid(8),
      role: "user",
      content: value,
    }
    const messages = [...messageListRef.current, message]

    changeMessageList(messages)
    setIsChat(true)
    workerRef.current?.postMessage({ type: "generate", data: messages })
  }

  useEffect(() => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    })
    workerRef.current = worker
    workerRef.current?.postMessage({
      type: "init",
      data: {
        remoteHost: `${window.injectData.resourcePath}${separator}resources${separator}models`,
      },
    })
    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case "errorMessage":
          message.error(e.data.message)
          setIsChat(false)
          break
        case "start":
          break
        case "update":
          const { output, tps, numTokens } = e.data
          console.log(output, tps, numTokens)
          const newList = cloneDeep(messageListRef.current)
          const lastMessage = newList[newList.length - 1]
          if (lastMessage.role === "user") {
            const newMessage = {
              id: nanoid(8),
              role: "assistant",
              content: output,
            }
            changeMessageList([...newList, newMessage])
          } else {
            lastMessage.content = output
            changeMessageList(newList)
          }
          break
        case "complete":
          setIsChat(false)
          console.log("Generation complete")
          break
      }
    }
    workerRef.current.addEventListener("message", onMessageReceived)
    return () => {
      workerRef.current?.removeEventListener("message", onMessageReceived)
    }
  }, [])

  return (
    <div styleName="chat">
      <div styleName="content">
        <div styleName="content-header">
          <div styleName="header-icon">
            <MessageOutlined />
          </div>
          <div styleName="header-text">AI 聊天</div>
        </div>
        <AppChatList messageList={messageList} />
      </div>
      <div styleName="footer">
        <AppChatInput onSearch={sendMessage} loading={isChat} />
      </div>
    </div>
  )
}
