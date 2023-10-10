import React from "react";
import { BucketItem } from "./bucketItem";
import { useBuckets } from "@/hooks/useBuckets";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

export const Buckets = () => {
  const { buckets } = useBuckets();
  // const { addDocument } = useFirestoreCollection("buckets");

  React.useEffect(() => {
    // addDocument({ simple: "right?" });
  }, []);

  if (!buckets) return <></>;

  return (
    <div className="grid grid-cols-5 gap-16">
      {buckets.map((bucket) => (
        <div key={bucket?.name}>
          <BucketItem
            data={bucket}
            name={bucket.name}
            preview={bucket.preview}
          />
        </div>
      ))}
    </div>
  );
};
