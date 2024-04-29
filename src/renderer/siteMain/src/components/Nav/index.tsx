import React, { useEffect, useState } from "react"
import {
  ContainerOutlined,
  NodeExpandOutlined,
  DesktopOutlined,
  HomeOutlined,
  VideoCameraOutlined,
  PictureOutlined,
  AudioOutlined,
  FallOutlined,
  SettingOutlined
} from "@ant-design/icons"
import type { MenuProps } from "antd"
import { Menu } from "antd"
import { ROUTERS } from "@siteMain/router/ROUTERS"
import { Route, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import appIcon from "@renderer/assets/images/icon.ico"
import "./index.module.less"

type MenuItem = Required<MenuProps>["items"][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem
}

const Nav: React.FC = () => {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [selectKey, setSelectKey] = useState<string[]>([])
  const { t } = useTranslation()

  const items: MenuItem[] = [
    // getItem(t("siteMain.components.nav.home"), ROUTERS.HOME, <HomeOutlined />),
    getItem(t("siteMain.components.nav.transcode"), ROUTERS.TRANSCODE, <NodeExpandOutlined />),
    getItem(t("siteMain.components.nav.extract"), ROUTERS.EXTRACT, <ContainerOutlined />),
    getItem(t("siteMain.components.nav.TTS"), ROUTERS.TTS, <AudioOutlined />),
    getItem(t("siteMain.components.nav.screenRecord"), ROUTERS.SCREEN_RECORD, <VideoCameraOutlined />),
    getItem(t("siteMain.components.nav.screenShot"), ROUTERS.SCREEN_SHOT, <PictureOutlined />),
    getItem(t("siteMain.components.nav.compress"), ROUTERS.COMPRESS, <FallOutlined />),
    getItem(t("siteMain.components.nav.setting"), ROUTERS.SETTING, <SettingOutlined />)
  ]

  // 点击菜单项后，路由跳转
  const handleMenuClick = (e: any) => {
    navigate(e.key)
  }

  // 更新menu样式
  const handleCollapse = () => {
    setCollapsed(window.innerWidth < 1000)
  }

  useEffect(() => {
    if (location.hash === "") {
      setSelectKey(["/"])
    } else {
      setSelectKey([location.hash.replace("#", "")])
    }
  }, [location.hash])

  useEffect(() => {
    handleCollapse()
    window.addEventListener("resize", handleCollapse)
    return () => {
      window.removeEventListener("resize", handleCollapse)
    }
  }, [])

  return (
    <div styleName="nav" className="site-main-nav">
      <div styleName="logo">
        <img styleName="img" onClick={() => navigate(ROUTERS.HOME)} src={appIcon} />
      </div>
      <Menu
        styleName="menu"
        selectedKeys={selectKey}
        mode="inline"
        // theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        onClick={handleMenuClick}
      />
    </div>
  )
}

export default Nav
