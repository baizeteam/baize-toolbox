import i18n from "i18next"
import enUS from "./modules/en_US.json"
import zhCN from "./modules/zh_CN.json"
import { app } from "electron"
import { store } from "../plugin/modules/store"

i18n.init({
  resources: {
    enUS: {
      translation: enUS
    },
    zhCN: {
      translation: zhCN
    }
  },
  lng: "zhCN",
  fallbackLng: "zhCN",
  interpolation: {
    escapeValue: false
  }
})

app.on("ready", () => {
  i18n.changeLanguage((store.get("i18n") as string) || "zhCN")
})

export default i18n
