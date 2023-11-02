import React from "react";
import { ReactQueryProvider } from "./ReactQuery";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const GlobalProvider = ({ children }) => {
  return (
    <ReactQueryProvider>
      {children}
      <ReactQueryDevtools />
    </ReactQueryProvider>
  );
};
