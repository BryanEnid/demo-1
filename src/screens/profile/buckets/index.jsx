import React from "react";
import { BucketItem } from "./BucketItem";
import { useBuckets } from "@/hooks/useBuckets";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

export const Buckets = () => {
  const { buckets } = useBuckets();

  if (!buckets) return <></>;

  React.useEffect(() => {
    console.log(buckets);
  }, [buckets]);

  return (
    <div className="grid grid-cols-5 gap-16">
      {buckets.map((bucket) => (
        <div key={bucket.id}>
          <BucketItem
            data={bucket}
            name={bucket.name}
            preview={bucket.preview}
            documentId={bucket.id}
          />
        </div>
      ))}
    </div>
  );
};
