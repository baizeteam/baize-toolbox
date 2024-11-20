import React from "react"
import "./index.module.less"
import AppMarkdown from "../AppMarkdown"

export default function AppChatList(props) {
  const { messageList } = props
  return (
    <div styleName="app-chat-list">
      {messageList.map((item) => (
        <div styleName={`chat-item${item.role === "user" ? " flex-end" : ""}`} key={item.id}>
          <div styleName={item.role === "user" ? "user" : "assistant"}>
            <AppMarkdown>{item.content}</AppMarkdown>
          </div>
        </div>
      ))}
    </div>
  )
}
