import { Button } from "antd"
import React from "react"
import { separator } from "@renderer/utils/fileHelper"
import { useTranslation } from "react-i18next"

export default function TransformersModels() {
  const { t } = useTranslation()
  return (
    <div>
      <Button
        onClick={() =>
          window.ipcInvoke("WIN_OPEN_FILE", {
            path: `${window.injectData.resourcePath}${separator}resources${separator}models`,
          })
        }
      >
        {t("translation:siteMain.pages.setting.transformersModels.openFolder")}
      </Button>
      <Button
        type="link"
        onClick={() => {
          window.ipcSend("OPEN_URL_IN_BROWSER", {
            url: "https://pan.baidu.com/s/1h3wepCIaShtqLbQW9diIng?pwd=x1wc",
          })
        }}
      >
        {t("translation:siteMain.pages.setting.transformersModels.downloadFromBaidu")}
      </Button>
      <Button
        type="link"
        onClick={() => {
          window.ipcSend("OPEN_URL_IN_BROWSER", {
            url: "https://www.alipan.com/s/AkMPGU6Mvwu",
          })
        }}
      >
        {t("translation:siteMain.pages.setting.transformersModels.downloadFromAliyun")}
      </Button>
      <Button
        type="link"
        onClick={() => {
          window.ipcSend("OPEN_URL_IN_BROWSER", {
            url: "https://huggingface.co/Xenova/Phi-3-mini-4k-instruct/tree/main",
          })
        }}
      >
        {t("translation:siteMain.pages.setting.transformersModels.huggingfaceSource")}
      </Button>
    </div>
  )
}
