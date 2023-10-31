import React from "react";

import { useCollection } from "@/hooks/useCollection";
import { useProfile } from "./useProfile";

export const useBuckets = () => {
  // Hooks
  const { profile } = useProfile();
  const { getBy } = useCollection("buckets", { keys: [profile.uid], query: {} });

  // State
  const [buckets, setBuckets] = React.useState(null);

  React.useEffect(() => {
    if (profile.uid) getBy("where", "creatorId", "==", profile.uid).then(setBuckets);
  }, [profile]);

  return { buckets };
};
