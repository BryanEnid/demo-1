import React from "react";

import { useCollection } from "@/hooks/useCollection";
import { useProfile } from "./useProfile";

export const useBuckets = () => {
  // Hooks
  const { data: profile } = useProfile();
  const {
    data: buckets,
    createDocument,
    deleteDocument,
  } = useCollection("buckets", {
    keys: [profile?.uid],
    query: ["where", "creatorId", "==", profile?.uid],
  });

  return { buckets, createDocument, deleteDocument };
};
