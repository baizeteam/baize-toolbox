import React, { useEffect, useState } from "react";
import {
  ContainerOutlined,
  NodeExpandOutlined,
  DesktopOutlined,
  HomeOutlined,
  VideoCameraOutlined,
  PictureOutlined,
  AudioOutlined,
  FallOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { ROUTERS } from "@renderer/router/ROUTERS";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./index.module.less";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectKey, setSelectKey] = useState<string[]>([]);
  const { t } = useTranslation();

  const items: MenuItem[] = [
    getItem(t("components.nav.home"), ROUTERS.HOME, <HomeOutlined />),
    getItem(
      t("components.nav.transcode"),
      ROUTERS.TRANSCODE,
      <NodeExpandOutlined />,
    ),
    getItem(
      t("components.nav.extract"),
      ROUTERS.EXTRACT,
      <ContainerOutlined />,
    ),
    getItem(t("components.nav.TTS"), ROUTERS.TTS, <AudioOutlined />),
    getItem(
      t("components.nav.screenRecord"),
      ROUTERS.SCREEN_RECORD,
      <VideoCameraOutlined />,
    ),
    getItem(
      t("components.nav.screenShot"),
      ROUTERS.SCREEN_SHOT,
      <PictureOutlined />,
    ),
    getItem(t("components.nav.compress"), ROUTERS.COMPRESS, <FallOutlined />),
    getItem(t("components.nav.setting"), ROUTERS.SETTING, <SettingOutlined />),
  ];

  useEffect(() => {
    if (location.hash === "") {
      setSelectKey(["/"]);
    } else {
      setSelectKey([location.hash.replace("#", "")]);
    }
  }, [location.hash]);

  const handleMenuClick = (e: any) => {
    navigate(e.key);
  };

  return (
    <div styleName="nav">
      <Menu
        selectedKeys={selectKey}
        mode="inline"
        // theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        onClick={handleMenuClick}
      />
    </div>
  );
};

export default Nav;
