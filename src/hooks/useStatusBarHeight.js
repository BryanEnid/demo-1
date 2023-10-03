import React, { useState } from "react";

export const useStatusBarHeight = () => {
  const [statusBarHeight, setStatusBarHeight] = React.useState();

  React.useEffect(() => {
    if (window.statusBarHeight) setStatusBarHeight(window.statusBarHeight);
  }, [window.statusBarHeight]);

  return { statusBarHeight };
};
