import { Button } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { nanoid } from "nanoid"
import AppInput from "../../components/AppInput"

interface MessageItem {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function Chat() {
  const workerRef = useRef<Worker | null>(null)
  const [messageList, setMessageList] = useState<MessageItem[]>([])

  const sendMessage = (value: string) => {
    const messages: MessageItem[] = [
      {
        id: nanoid(8),
        role: "user",
        content: value,
      },
    ]
    setMessageList((prev) => [...prev, ...messages])
    workerRef.current?.postMessage({ type: "generate", data: messages })
  }

  useEffect(() => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    })
    workerRef.current = worker
    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case "start":
          break
        case "update":
          {
            const { output, tps, numTokens } = e.data
            console.log(output, tps, numTokens)
          }
          break
        case "complete":
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
    <div>
      <div>chat</div>
      <Button onClick={() => sendMessage("你好呀")}>send</Button>
      <AppInput />
    </div>
  )
}
