import React from "react";
import { useLocation } from "react-router-dom";
import { useCollection } from "@/hooks/useCollection";

export const useProfile = () => {
  // Hooks
  const { pathname } = useLocation();

  return useCollection("users", {
    keys: [pathname.slice(1).split("/")[0]],
    query: ["where", "username", "==", pathname.slice(1).split("/")[0]],
    select: (item) => item[0],
  });
};
