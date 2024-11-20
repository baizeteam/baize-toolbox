import React, { useState, useRef, useEffect } from "react"
import { Input } from "antd"

export default function AppChatInput(props) {
  const { onSearch, ...rest } = props
  const [_value, _setValue] = useState("")

  const handleChange = (e) => {
    _setValue(e.target.value)
  }

  const handleSearch = () => {
    _setValue("")
    onSearch(_value)
  }
  return <Input.Search value={_value} enterButton="发送" onChange={handleChange} {...rest} onSearch={handleSearch} />
}
