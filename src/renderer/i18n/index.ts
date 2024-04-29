import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enUS from "./modules/en_US.json"
import zhCN from "./modules/zh_CN.json"

import antdzhCN from "antd/locale/zh_CN"
import antdenUS from "antd/locale/en_US"

i18n.use(initReactI18next).init({
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

export const antdLocale = {
  enUS: antdenUS,
  zhCN: antdzhCN
}

export default i18n
