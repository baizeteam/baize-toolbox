import { useEffect, useRef, useCallback } from "react";

export const useElectronDrag = (dom?) => {
  const offsetX = useRef(0);
  const offsetY = useRef(0);
  const electronWinPos = useRef([]);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(async (e) => {
    console.log("handleMouseDown");
    e.stopPropagation();
    e.preventDefault();
    const position = await window.api.getWinPosition();
    electronWinPos.current = position;
    isDragging.current = true;
    offsetX.current = e.screenX;
    offsetY.current = e.screenY;
  }, []);
  const handleMouseMove = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isDragging.current && electronWinPos.current.length === 2) {
      requestAnimationFrame(() => {
        const x = e.screenX - offsetX.current + electronWinPos.current[0];
        const y = e.screenY - offsetY.current + electronWinPos.current[1];
        const pos = {
          x: x,
          y: y,
        };
        window.api.dragWin(pos);
      });
    }
  }, []);
  const handleMouseUp = useCallback((e) => {
    electronWinPos.current = [];
    isDragging.current = false;
  }, []);
  useEffect(() => {
    const _dom = dom || window;
    _dom.addEventListener("mousedown", handleMouseDown);
    _dom.addEventListener("mousemove", handleMouseMove);
    _dom.addEventListener("mouseup", handleMouseUp);
    return () => {
      _dom.removeEventListener("mousedown", handleMouseDown);
      _dom.removeEventListener("mousemove", handleMouseMove);
      _dom.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dom]);
};
