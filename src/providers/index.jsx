import React from "react";
import { ReactQueryProvider } from "./ReactQuery";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const GlobalProvider = ({ children }) => {
  return (
    <ReactQueryProvider>
      <React.Suspense fallback={<>Loading</>}>{children}</React.Suspense>
      <ReactQueryDevtools />
    </ReactQueryProvider>
  );
};
