import { Button } from "antd"
import React from "react"
import { separator } from "@renderer/utils/fileHelper"

export default function TransformersModels() {
  return (
    <div>
      <Button
        onClick={() =>
          window.ipcInvoke("WIN_OPEN_FILE", {
            path: `${window.injectData.resourcePath}${separator}resources${separator}models`,
          })
        }
      >
        打开聊天模型文件夹
      </Button>
      <Button
        type="link"
        onClick={() => {
          window.ipcSend("OPEN_URL_IN_BROWSER", {
            url: "https://pan.baidu.com/s/1h3wepCIaShtqLbQW9diIng?pwd=x1wc",
          })
        }}
      >
        从百度网盘下载
      </Button>
      <Button
        type="link"
        onClick={() => {
          window.ipcSend("OPEN_URL_IN_BROWSER", {
            url: "https://www.alipan.com/s/AkMPGU6Mvwu",
          })
        }}
      >
        从阿里云盘下载
      </Button>
      <Button
        type="link"
        onClick={() => {
          window.ipcSend("OPEN_URL_IN_BROWSER", {
            url: "https://huggingface.co/Xenova/Phi-3-mini-4k-instruct/tree/main",
          })
        }}
      >
        huggingface源文件
      </Button>
    </div>
  )
}
