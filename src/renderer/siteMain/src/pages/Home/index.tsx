import React from "react"
import "./index.module.less"
import appIcon from "@renderer/assets/images/icon.ico"
import { useTranslation } from "react-i18next"
import { Button } from "antd"

function App() {
  const { t } = useTranslation()

  // 打开官方网站
  const openOfficialWebsite = () => {
    window.open("https://baize.plume.vip")
  }

  return (
    <div styleName="home">
      <div styleName="content">
        <img styleName="img" onClick={openOfficialWebsite} src={appIcon} />

        <div styleName="title">{t("siteMain.pages.home.title")}</div>
        <div styleName="desc">{t("siteMain.pages.home.desc")}</div>
      </div>
      <div styleName="footer">
        <Button type="link" onClick={openOfficialWebsite}>
          {t("siteMain.pages.home.officialWebsite")}
        </Button>
        <Button type="link" onClick={() => window.open("https://github.com/baizeteam/baize-toolbox")}>
          Github
        </Button>
      </div>
    </div>
  )
}

export default App
