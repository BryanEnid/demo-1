import React from "react";
import { ReactQueryProvider } from "./ReactQuery";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./Authentication";

export const GlobalProvider = ({ children }) => {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        {children}
        <ReactQueryDevtools />
      </AuthProvider>
    </ReactQueryProvider>
  );
};
