import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Screens
import { Landpage } from "./screens/landpage/Landpage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landpage />,
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
