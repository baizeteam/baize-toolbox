import React from "react"
import "./index.module.less"

export default function AppChatList(props) {
  const { messageList } = props
  return (
    <div styleName="app-chat-list">
      {messageList.map((item) => (
        <div styleName="chat-item" key={item.id}>
          <div styleName={item.role === "user" ? "user" : "assistant"}>{item.content}</div>
        </div>
      ))}
    </div>
  )
}
