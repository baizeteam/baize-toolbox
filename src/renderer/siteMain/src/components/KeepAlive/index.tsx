import { ROUTERS } from "@siteMain/router/ROUTERS";
import { useUpdate } from "ahooks";
import { useEffect, useRef } from "react";
import { useLocation, useOutlet, useNavigate } from "react-router-dom";
import "./index.module.less";

function KeepAlive(props) {
  const componentList = useRef(new Map());
  const navigate = useNavigate();
  const outLet = useOutlet();
  const { pathname } = useLocation();
  const forceUpdate = useUpdate();

  useEffect(() => {
    if (pathname === "/") {
      navigate(ROUTERS.HOME);
      return;
    }
    if (!componentList.current.has(pathname)) {
      componentList.current.set(pathname, outLet);
    }
    forceUpdate();
  }, [pathname]);

  return Array.from(componentList.current).map(([key, component]) => (
    <div
      key={key}
      styleName="keep-alive"
      style={{ display: pathname === key ? "block" : "none" }}
    >
      {component}
    </div>
  ));
}

export default KeepAlive;
