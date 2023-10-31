import React from "react";
import ReactDOM from "react-dom/client";
import { Routes } from "./Routes";

import "./Global.css";
import { GlobalProvider } from "./providers";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <Routes />
    </GlobalProvider>
  </React.StrictMode>
);

// if ("serviceWorker" in navigator) {
//   console.log("yay");
// window.addEventListener("load", () => {
//   navigator.serviceWorker
//     .register("./sw.js")
//     .then((registration) => {
//       console.log("Service Worker registered with scope:", registration.scope);
//     })
//     .catch((error) => {
//       console.error("Service Worker registration failed:", error);
//     });
// });
// }
