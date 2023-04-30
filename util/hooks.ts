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
    const height = window.innerHeight;
    const width = window.innerWidth;

    function handleResize() {
      setWindowSize({ height, width });
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
