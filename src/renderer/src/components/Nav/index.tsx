import React, { useEffect, useState } from "react";
import {
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
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
    getItem(t("components.nav.home"), ROUTERS.HOME, <PieChartOutlined />),
    getItem(
      t("components.nav.transcode"),
      ROUTERS.TRANSCODE,
      <DesktopOutlined />,
    ),
    getItem(
      t("components.nav.extract"),
      ROUTERS.EXTRACT,
      <ContainerOutlined />,
    ),
    getItem(t("components.nav.TTS"), ROUTERS.TTS, <ContainerOutlined />),
    getItem(
      t("components.nav.screenRecord"),
      ROUTERS.SCREEN_RECORD,
      <ContainerOutlined />,
    ),
    getItem(
      t("components.nav.screenShot"),
      ROUTERS.SCREEN_SHOT,
      <ContainerOutlined />,
    ),
    getItem(
      t("components.nav.compress"),
      ROUTERS.COMPRESS,
      <ContainerOutlined />,
    ),
    getItem(
      t("components.nav.setting"),
      ROUTERS.SETTING,
      <ContainerOutlined />,
    ),
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
