import { Button } from "@/chadcn/Button";
import { Typography } from "@/chadcn/Typography";
import { PageModal } from "@/components/PageModal";
import { useUserData } from "@/hooks/useUserData";
import { Icon } from "@iconify/react";
import React from "react";

export const BucketItem = ({ name, preview, data, onChange }) => {
  const { user } = useUserData();
  const [open, setOpen] = React.useState(false);
  const [currentVideo, setCurrentVideo] = React.useState(0);
  // const [isFullscreen, setIsFullscreen] = React.useState(false);
  const videoRef = React.useRef();

  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    // if (!isFullscreen) {
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.mozRequestFullScreen) {
      videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) {
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) {
      videoElement.msRequestFullscreen();
    }
    // } else {
    //   if (document.exitFullscreen) {
    //     document.exitFullscreen();
    //   } else if (document.mozCancelFullScreen) {
    //     document.mozCancelFullScreen();
    //   } else if (document.webkitExitFullscreen) {
    //     document.webkitExitFullscreen();
    //   } else if (document.msExitFullscreen) {
    //     document.msExitFullscreen();
    //   }
    // }

    // Toggle the fullscreen state
    setIsFullscreen(!isFullscreen);
  };

  const handleNextVideo = () => {
    if (!(currentVideo === data.data.length - 1))
      return setCurrentVideo(currentVideo + 1);

    return setCurrentVideo(0);
  };

  const handleExit = () => {
    setCurrentVideo(0);
    setOpen(false);
  };

  if (!user) return <></>;

  return (
    <>
      <div className="flex flex-col items-center">
        <button onClick={() => setOpen(true)} className="">
          <video
            autoPlay
            muted
            loop
            src={preview}
            className=" object-cover aspect-square shadow drop-shadow-xl p-1 bg-white rounded-full"
          />
        </button>

        <Typography>{name}</Typography>
      </div>

      <PageModal show={open} onClose={handleExit}>
        {/* Video Player */}
        <div className="aspect-[16/9] shadow bg-black">
          <div className="w-full h-full backdrop-blur-md">
            <video
              autoPlay
              controls={false}
              ref={videoRef}
              src={data.data[currentVideo].low_quality_preview.link}
              onEnded={handleNextVideo}
              className="w-full h-full object-center rounded-none z-10"
            />

            <div className="transition cursor-pointer absolute top-2 right-4 p-1 rounded-md bg-slate-300/20 backdrop-blur-sm border-white border hover:bg-slate-300/50">
              <Icon
                onClick={toggleFullscreen}
                className="text-3xl text-white"
                icon="iconamoon:screen-full-duotone"
              />
            </div>
          </div>
        </div>

        <div className="text-white flex flex-row h-48 px-8 my-6">
          <div className="flex basis-2/12 flex-col items-center gap-2 justify-center">
            <img
              src={user.picture.md}
              className="rounded-full object-cover w-20"
            />
            <Typography variant="small">215k</Typography>
            <Button variant="secondary">Anchor</Button>
          </div>

          <div className="flex basis-10/12 flex-col w-full gap-8 pl-4 pb-4">
            <div className="flex flex-row justify-between items-center">
              <div>
                <Typography variant="large">{user.name}</Typography>
                <Typography variant="small">{user.role}</Typography>
              </div>
              <div>
                <Button variant="secondary">Edit Bucket</Button>
              </div>
            </div>

            <div>
              <div>
                <Typography variant="large">{data.title}</Typography>
                <Typography variant="small">{data.description}</Typography>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center my-6 mt-10">
          <div className="grid grid-cols-4 gap-5">
            {data.data.map((video) => (
              <img
                src={video.video_pictures[0].picture}
                className=" rounded-lg object-cover w-40 h-28"
              />
            ))}
          </div>
        </div>
      </PageModal>
    </>
  );
};
