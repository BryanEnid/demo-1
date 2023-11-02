import React from "react";
import { useCollection } from "./useCollection";
import { useAuthentication } from "./useAuthentication";

export const useUser = () => {
  // Initialize Firebase Auth
  const { user } = useAuthentication();

  const { data } = useCollection("users", {
    keys: [user?.uid],
    query: ["where", "uid", "==", user?.uid],
    select: (item) => item[0],
    enabled: !!user?.uid,
  });

  return { user: user ? { ...user, ...data } : null };
};
