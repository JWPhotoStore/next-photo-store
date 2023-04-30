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
    const width = window.innerWidth;
    const height = window.innerHeight;

    function handleResize() {
      setWindowSize({ height, width });
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
