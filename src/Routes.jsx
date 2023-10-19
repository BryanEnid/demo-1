import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Screens
import { Landpage } from "./screens/landpage/Landpage";
import { Profile } from "./screens/profile";
import { CaptureScreen } from "./screens/capture/Capture.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landpage />,
  },
  {
    path: "/profile/*",
    element: <Profile />,
  },
  {
    path: "/capture/*",
    element: <CaptureScreen />,
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
