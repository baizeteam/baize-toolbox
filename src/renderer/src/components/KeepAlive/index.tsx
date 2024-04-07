import { ROUTERS } from "@renderer/router/ROUTERS";
import { useUpdate } from "ahooks";
import { useEffect, useRef } from "react";
import { useLocation, useOutlet, useNavigate } from "react-router-dom";

function KeepAlive(props) {
  const componentList = useRef(new Map());
  const navigate = useNavigate();
  const outLet = useOutlet();
  const { pathname } = useLocation();
  const forceUpdate = useUpdate();

  useEffect(() => {
    console.log("pathname", pathname);
    if (pathname === "/") {
      navigate(ROUTERS.HOME);
      return;
    }
    if (!componentList.current.has(pathname)) {
      componentList.current.set(pathname, outLet);
    }
    forceUpdate();
  }, [pathname]);

  return (
    <div>
      {Array.from(componentList.current).map(([key, component]) => (
        <div key={key} style={{ display: pathname === key ? "block" : "none" }}>
          {component}
        </div>
      ))}
    </div>
  );
}

export default KeepAlive;
