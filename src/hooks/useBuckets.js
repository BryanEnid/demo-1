import React from "react";

import { useCollection } from "@/hooks/useCollection";
import { useProfile } from "./useProfile";
import { useUser } from "./useUser";

export const useBuckets = (owner) => {
  // Hooks
  const { data: profile } = useProfile();
  const { user } = useUser();

  const content = owner === "user" ? [user?.uid] : [profile?.uid];
  const enabled = !!user?.uid || !!profile?.uid;

  const {
    data: buckets,
    createDocument,
    deleteDocument,
  } = useCollection("buckets", {
    keys: [...content],
    query: ["where", "creatorId", "==", content[0]],
    enabled: enabled,
  });

  return { buckets, createDocument, deleteDocument };
};
