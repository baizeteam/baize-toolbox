import React, { useEffect, useState } from "react"
import { Button } from "antd"
import { useTranslation } from "react-i18next"
import EllipsisTextControl from "@renderer/components/EllipsisTextControl"
import "./index.module.less"

export default function WhisperModelPath() {
  const [whisperModelPath, setWhisperModelPath] = useState()
  const { t } = useTranslation()
  useEffect(() => {
    window.electron.ipcRenderer.invoke("GET_STORE", "whisperModelPath").then((res) => {
      setWhisperModelPath(res)
    })
  }, [])

  // 修改默认存储路径
  const onChangeWhisperModelPath = async () => {
    const res = await window.ipcInvoke("WIN_SELECT_FILE")
    if (!res) {
      return
    }
    const path = res[0]
    setWhisperModelPath(path)
    await window.ipcInvoke("SET_STORE", "whisperModelPath", path)
  }
  return (
    <div styleName="whisper-model-path">
      <div styleName="block">
        <div styleName="title">
          <div>{t("siteMain.pages.setting.whisperModelPath")}</div>
          <div
            styleName="download"
            onClick={() => {
              window.open("https://huggingface.co/ggerganov/whisper.cpp/tree/main", "_blank")
            }}
          >
            {t("commonText.download")}
          </div>
        </div>
        <div styleName="path">
          <div styleName="text">
            <EllipsisTextControl maxWidth={270} content={whisperModelPath || "暂无"} />
          </div>
          <Button type="primary" styleName="btn" onClick={onChangeWhisperModelPath}>
            {t("siteMain.pages.setting.change")}
          </Button>
        </div>
      </div>
    </div>
  )
}
