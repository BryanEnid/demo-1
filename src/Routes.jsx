import * as React from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";

// Screens
import { Landpage } from "./screens/landpage/Landpage";
import { CaptureScreen } from "./screens/capture/Capture.jsx";

import { Profile } from "./screens/profile";
import { Buckets } from "./screens/profile/buckets";
import { Experience } from "./screens/profile/experience/Experience";
import { Preview } from "./screens/video_preview/Preview";
import { SignIn } from "./screens/sign_in/SignIn";

export const Routes = (props) => {
  // TODO: Preload all icons

  const router = createBrowserRouter([
    {
      path: "/",
      element: <SignIn />,
    },

    {
      path: "/capture/*",
      element: <CaptureScreen />,
    },
    {
      path: "/capture/preview",
      element: <Preview />,
    },
    {
      path: "/:id",
      element: <Profile />,
      children: [
        { path: "", element: <Buckets /> },

        { path: "audio", element: <>audio</> },
        { path: "buckets", element: <Buckets /> },
        { path: "experience", element: <Experience /> },
        { path: "recommends", element: <>recommends</> },
        { path: "quests", element: <>quests</> },
        { path: "website", element: <>website</> },
      ],
    },
    {
      path: "/notfound",
      element: <>not found</>,
    },
  ]);

  return <RouterProvider router={router} />;
};
