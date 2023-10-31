import React from "react";
import { useLocation } from "react-router-dom";
import { useCollection } from "@/hooks/useCollection";

export const useProfile = () => {
  // Hooks
  const { pathname } = useLocation();

  return useCollection("users", {
    keys: [pathname.slice(1).split("/")[0]],
    query: { queryType: "where", property: "username", operation: "==", value: pathname.slice(1).split("/")[0] },
    select: console.log,
  });
};
