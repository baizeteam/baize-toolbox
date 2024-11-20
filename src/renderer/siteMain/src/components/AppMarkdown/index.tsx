import React from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function AppMarkdown(props) {
  const { children } = props
  return <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
}
