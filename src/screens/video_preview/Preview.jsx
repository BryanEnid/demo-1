import React from "react";
import { useIndexedDBVideos } from "@/hooks/useIndexedDBVideos";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Button } from "@/chadcn/Button";
import { generatePreview } from "@/lib/utils";
import { useCollection } from "@/hooks/useCollection";
import { useBuckets } from "@/hooks/useBuckets";
import { Typography } from "@/chadcn/Typography";
import { Card } from "@/chadcn/Card";
import { BucketItem } from "../profile/buckets/BucketItem";
import { Icon } from "@iconify/react";
import { Progress } from "@/chadcn/Progress";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

export const Preview = () => {
  // Hooks
  const { getVideo, videos } = useIndexedDBVideos("local-unlisted-videos", 1);
  const { id: videoIdIDB } = useQueryParams();
  const { uploadFile, uploadResumableFile, appendVideo } = useCollection("buckets");
  const { buckets } = useBuckets("user");
  const { user } = useUser();
  const navigate = useNavigate();

  // State
  const [video, setVideo] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [selectedBucket, setSelectedBucket] = React.useState();
  const [isSubmitable, setSubmitable] = React.useState(false);
  const [isUploading, setUploading] = React.useState(false);
  const [unlistedVideoSelected, setUnlistedVideoSelected] = React.useState();

  React.useEffect(() => {
    getVideo(Number(videoIdIDB))
      .then((video) => {
        setVideo(video);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      setLoading(true);
      setVideo(null);
    };
  }, [videoIdIDB]);

  const handleSelectedBucket = (data) => {
    setSelectedBucket(data);
    setSubmitable(true);
  };

  const handleUnlistedSelectedVideo = (video) => {
    setUnlistedVideoSelected(video);
  };

  const handleSaveVideo = async () => {
    setUploading(true);
    const recordedVideo = new Blob([video.blob], { type: "video/mp4" });

    const preview = await generatePreview(recordedVideo);
    const imageUrl = await uploadFile({ file: preview, fileType: "image" });
    const { uploadTask, getDownloadURL } = await uploadResumableFile({ file: recordedVideo, fileType: "video" });
    // Render progress
    uploadTask.on("state_changed", (snapshot) => setUploadProgress(Math.ceil((snapshot.bytesTransferred * 100) / snapshot.totalBytes)));
    // When finish uploading
    uploadTask.then(() => {
      getDownloadURL().then((videoUrl) => {
        // if bucket id -> save it to that bucket id
        // otherwise set it to unlisted
        // for now dont save it
        if (selectedBucket.id) {
          appendVideo(
            { videoData: { image: imageUrl, videoUrl: videoUrl }, documentId: selectedBucket.id },
            {
              onSuccess: () => {
                setUploading(false);
                navigate({ pathname: `/profile`, search: createSearchParams({ focus: selectedBucket.id }).toString() });
              },
              onError: (e) => console.log("appendVideo", e),
            }
          );
          if (isUploading) setUploading(false);
        }
      });
    });
  };

  if (isLoading) return <>loading ...</>;

  if (!video) return <>THERE ARE NO VIDEOS</>;

  return (
    <>
      <div className="grid grid-cols-5 h-screen">
        <div className="flex flex-col col-span-4">
          <div className="flex flex-1 justify-center  bg-black">
            <video controls autoPlay muted loop controlsList="nofullscreen">
              <source src={URL.createObjectURL(video.blob)} type="video/mp4" />
            </video>
          </div>

          <div className="flex flex-col min-h-[200px] max-h-[400px] overflow-y-auto p-4">
            <Typography variant="large">Unlisted Videos</Typography>
            <div className="flex flex-row gap-4 w-full flex-wrap mt-4">
              {videos?.map((video) => (
                <button key={video.id} onClick={() => handleUnlistedSelectedVideo(video)}>
                  <video src={URL.createObjectURL(video.blob)} className="w-[250px] border-4 rounded-xl" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col h-screen justify-between p-4 bg-[#001027]">
          <div className="text-white">
            {buckets?.map((bucket) => (
              <div key={bucket.id} className={selectedBucket?.id === bucket?.id ? "opacity-100" : "opacity-50"}>
                <BucketItem data={bucket} name={bucket.name} preview={bucket.videos[0]?.videoUrl} documentId={bucket.id} onClick={handleSelectedBucket} />
              </div>
            ))}
          </div>

          {!isUploading ? (
            <div className="flex flex-col gap-4">
              <Button variant="outline" className="p-2" onClick={() => navigate("/profile")}>
                Cancel
              </Button>
              <Button onClick={handleSaveVideo} disabled={!isSubmitable} className="p-2 h-16 ">
                Save video
              </Button>
            </div>
          ) : (
            <div className="flex rounded-full p-2 bg-primary h-16 text-white relative justify-center items-center text-primary">
              <Icon width={45} icon="line-md:uploading-loop" />

              <div className="flex flex-row text-sm ">
                <div className="flex flex-col gap-1 font-medium justify-center items-center p-2 px-6">
                  <div className="flex flex-row truncate gap-2">{uploadProgress}% Uploading ...</div>

                  <Progress className="border" color="bg-white" value={uploadProgress} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
