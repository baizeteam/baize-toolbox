import React, { useEffect } from "react";

export const usePenetrateListener = (ref) => {
  const handleMouseEnter = () => {
    window.electron.ipcRenderer.invoke("WIN_PENTRATE_OPEN");
  };

  const handleMouseLeave = () => {
    window.electron.ipcRenderer.invoke("WIN_PENTRATE_CLOSE");
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("mouseenter", handleMouseEnter);
      ref.current.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        ref.current.removeEventListener("mouseenter", handleMouseEnter);
        ref.current.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
    return () => {};
  }, [ref.current]);
};
