import React from "react";

import { useCollection } from "@/hooks/useCollection";
import { useProfile } from "./useProfile";

export const useBuckets = () => {
  // Hooks
  const { profile } = useProfile();
  const { data } = useCollection("buckets", {
    keys: [profile.uid],
    query: { queryType: "where", property: "username", operation: "==", value: profile.username },
  });

  // State
  const [buckets, setBuckets] = React.useState(null);

  React.useEffect(() => {
    console.log(data);
    // if (profile.uid) getBy("where", "creatorId", "==", profile.uid).then(setBuckets);
  }, [data]);

  return { buckets };
};
