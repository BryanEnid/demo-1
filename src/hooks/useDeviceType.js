import { useState, useEffect } from "react";

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState(getDeviceType());
  const isMobile = deviceType === "mobile";
  const isTablet = deviceType === "tablet";
  const isDesktop = deviceType === "desktop";

  function getDeviceType() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 768) {
      return "mobile";
    } else if (screenWidth <= 1024) {
      return "tablet";
    } else {
      return "desktop";
    }
  }

  useEffect(() => {
    function handleResize() {
      const newDeviceType = getDeviceType();
      if (newDeviceType !== deviceType) {
        setDeviceType(newDeviceType);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [deviceType]);

  return { deviceType, isMobile, isTablet, isDesktop };
};
