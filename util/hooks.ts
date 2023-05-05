import { useEffect, useState } from "react";

type WindowSizeType = {
  height: undefined | number;
  width: undefined | number;
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSizeType>({
    height: undefined,
    width: undefined,
  });

  useEffect(() => {
    function handleResize() {
      let height = window.innerHeight;
      let width = window.innerWidth;
      setWindowSize({ height, width });
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
