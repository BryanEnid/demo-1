import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Screens
import { Landpage } from "./screens/landpage/Landpage";
import { CameraScreen } from "./screens/camera/Camera.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landpage />,
  },
  {
    path: "/camera",
    element: <CameraScreen />,
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
