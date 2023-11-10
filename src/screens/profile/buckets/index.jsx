import React from "react";
import { BucketItem } from "./BucketItem";
import { useBuckets } from "@/hooks/useBuckets";

export const Buckets = () => {
  const { buckets } = useBuckets();

  console.log("buckets", buckets);

  if (!buckets?.length) return <></>;

  return (
    <div className="grid grid-cols-5 gap-16">
      {buckets.map((bucket) => (
        <div key={bucket.id}>
          <BucketItem data={bucket} name={bucket.name} preview={bucket.videos[0]?.videoUrl} documentId={bucket.id} />
        </div>
      ))}
    </div>
  );
};
