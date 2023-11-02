import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Screens
import { Landpage } from "./screens/landpage/Landpage";
import { CaptureScreen } from "./screens/capture/Capture.jsx";

import { Profile } from "./screens/profile";
import { Buckets } from "./screens/profile/buckets";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landpage />,
  },
  {
    path: "/:id",
    element: <Profile />,
    children: [
      { path: "", element: <>homepage</> },
      { path: "buckets", element: <Buckets /> },
      { path: "experience", element: <>experience</> },
    ],
  },
  {
    path: "/capture/*",
    element: <CaptureScreen />,
  },
]);

export const Routes = (props) => {
  // TODO: Preload all icons

  return <RouterProvider router={router} />;
};
