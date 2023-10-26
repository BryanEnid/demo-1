import React from "react";
import { usePexelsVideoSearch } from "./usePexelsVideoSearch";
import { useCollection } from "./useCollection";

export const useBuckets = () => {
  // const [buckets, setBuckets] = React.useState(null);
  const { data: buckets } = useCollection("buckets");
  // const { fetchVideos } = usePexelsVideoSearch({});

  // Fetch buckets data and populate
  // React.useEffect(() => {
  //   // Fetch from server

  //   // Fake data
  //   fetchVideos({ perPage: 10 }).then(({ videos }) => {
  //     videos = videos.map((video) => {
  //       const temp_video = { ...video };
  //       temp_video.low_quality_preview = temp_video.video_files.find(
  //         ({ quality }) => quality === "sd"
  //       );
  //       return temp_video;
  //     });

  //     const chunkSize = Math.ceil(videos.length / 5); // Calculate the chunk size

  //     const splittedArrays = Array.from({ length: 5 }, (_, index) =>
  //       videos.slice(index * chunkSize, (index + 1) * chunkSize)
  //     );

  //     // Populate
  //     setBuckets([
  //       {
  //         name: "AC Motor",
  //         title: "All About Advancing Manufacturing",
  //         description:
  //           'Are you eager to dive into the dynamic world of modern manufacturing? The "All About Advancing Manufacturing" bucket I’ve designed provides a comprehensive overview of the latest advancements, strategies, and technologies shaping the manufacturing industry today.',
  //         data: splittedArrays[0],
  //         preview: splittedArrays[0][0].low_quality_preview.link,
  //       },
  //       {
  //         name: "Tesla Coil",
  //         title: "All About Advancing Manufacturing",
  //         description:
  //           'Are you eager to dive into the dynamic world of modern manufacturing? The "All About Advancing Manufacturing" bucket I’ve designed provides a comprehensive overview of the latest advancements, strategies, and technologies shaping the manufacturing industry today.',
  //         data: splittedArrays[1],
  //         preview: splittedArrays[1][0].low_quality_preview.link,
  //       },
  //       {
  //         name: "Hydroelectricity",
  //         title: "All About Advancing Manufacturing",
  //         description:
  //           'Are you eager to dive into the dynamic world of modern manufacturing? The "All About Advancing Manufacturing" bucket I’ve designed provides a comprehensive overview of the latest advancements, strategies, and technologies shaping the manufacturing industry today.',
  //         data: splittedArrays[2],
  //         preview: splittedArrays[2][0].low_quality_preview.link,
  //       },
  //       {
  //         name: "Tesla Valve",
  //         title: "All About Advancing Manufacturing",
  //         description:
  //           'Are you eager to dive into the dynamic world of modern manufacturing? The "All About Advancing Manufacturing" bucket I’ve designed provides a comprehensive overview of the latest advancements, strategies, and technologies shaping the manufacturing industry today.',
  //         data: splittedArrays[3],
  //         preview: splittedArrays[3][0].low_quality_preview.link,
  //       },
  //       {
  //         name: "Oscillator",
  //         title: "All About Advancing Manufacturing",
  //         description:
  //           'Are you eager to dive into the dynamic world of modern manufacturing? The "All About Advancing Manufacturing" bucket I’ve designed provides a comprehensive overview of the latest advancements, strategies, and technologies shaping the manufacturing industry today.',
  //         data: splittedArrays[4],
  //         preview: splittedArrays[4][0].low_quality_preview.link,
  //       },
  //     ]);
  //   });
  // }, []);

  return { buckets };
};
