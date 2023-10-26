import React from "react";
import { BucketItem } from "./BucketItem";
import { useBuckets } from "@/hooks/useBuckets";
import { useCollection } from "@/hooks/useCollection";
import { usePexelsVideoSearch } from "@/hooks/usePexelsVideoSearch";

export const Buckets = () => {
  const { buckets } = useBuckets();

  const { addDocument } = useCollection("buckets");
  const { fetchVideos } = usePexelsVideoSearch();

  if (!buckets) return <></>;

  // React.useEffect(() => {
  //   fetchVideos({ perPage: 10, page: 1 }).then(({ videos }) => {
  //     videos = videos.map(({ image, video_files }) => ({
  //       image,
  //       videoUrl: video_files[0].link,
  //     }));

  //     addDocument(
  //       { videos, title: "", name: "Bucket 1", description: "" },
  //       "2g37bcSO33wpS0LsvBDG"
  //     );
  //   });

  //   fetchVideos({ perPage: 10, page: 2 }).then(({ videos }) => {
  //     videos = videos.map(({ image, video_files }) => ({
  //       image,
  //       videoUrl: video_files[0].link,
  //     }));

  //     addDocument(
  //       { videos, title: "", name: "Bucket 2", description: "" },
  //       "3OzVrpNFB5gohvVI8omB"
  //     );
  //   });
  // }, []);

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
