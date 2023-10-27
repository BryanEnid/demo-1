import React from "react";

import { useCollection } from "@/hooks/useCollection";
import { useProfile } from "./useProfile";

export const useBuckets = () => {
  // Hooks
  const { getBy } = useCollection("buckets", true);
  const { profile } = useProfile();

  // State
  const [buckets, setBuckets] = React.useState(null);

  React.useEffect(() => {
    if (profile.uid) getBy("where", "creatorId", "==", profile.uid).then(setBuckets);
  }, [profile]);

  return { buckets };
};
