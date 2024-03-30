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
import "./index.module.less";

type MenuItem = Required<MenuProps>["items"][number];

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
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("主页", ROUTERS.HOME, <PieChartOutlined />),
  getItem("转码", ROUTERS.TRANSCODE, <DesktopOutlined />),
  getItem("设置", ROUTERS.SETTING, <ContainerOutlined />),
];

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectKey, setSelectKey] = useState<string[]>([]);

  useEffect(() => {
    setSelectKey([location.pathname]);
  }, [location.pathname]);

  const handleMenuClick = (e: any) => {
    console.log("click ", e.key);
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
