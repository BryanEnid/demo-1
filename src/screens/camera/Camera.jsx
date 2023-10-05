import React from "react";
import Webcam from "react-webcam";

import { NavBar } from "@/components/NavBar";
import { SideBar } from "@/components/SideBar";
import { DebugOverlay } from "@/components/DebugOverlay";

import { Video360 } from "@/components/MediaPlayer";

const CameraSize = 180;

export const CameraScreen = () => {
  const [videoType, setVideoType] = React.useState("Screen recorder");
  const [stream, setStream] = React.useState(null);
  const [isScreenRecording, setScreenRecording] = React.useState(false);

  const video360Ref = React.useRef(null);
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    async function getMediaStream() {
      const config = { video: true, audio: false };
      const stream = await navigator.mediaDevices.getDisplayMedia(config);
      setStream(stream);
      videoRef.current.srcObject = stream;
    }

    if (!stream && isScreenRecording) getMediaStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null); // Reset the stream state
      }
    };
  }, [stream, isScreenRecording]);

  const toggleRecording = () => setScreenRecording(!isScreenRecording);

  const handle360Video = (ref, video) => {
    video360Ref.current = { ref, video };
  };

  return (
    <>
      <div className="h-screen w-screen bg-slate-300">
        {videoType === "Screen recorder" ? (
          <>
            {isScreenRecording && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-screen h-screen"
              />
            )}
          </>
        ) : (
          <>
            <Video360
              onVideoReady={handle360Video}
              className="w-screen h-screen"
            />
          </>
        )}

        {/* WebCam */}
        {isScreenRecording && stream && (
          <div
            style={{ height: CameraSize, width: CameraSize }}
            className="flex absolute bottom-10 right-20 rounded-full items-center justify-center bg-black"
          >
            <Webcam
              mirrored
              videoConstraints={{
                height: CameraSize,
                width: CameraSize,
                // facingMode: cameraPosition.current,
              }}
              onUserMedia={console.log}
              className="rounded-full z-10"
            />

            <span class="animate-ping absolute inline-flex h-4/6 w-4/6 rounded-full bg-red-600" />
          </div>
        )}

        {/* Overlay Actions */}
        <NavBar />

        <SideBar />

        <DebugOverlay
          data={[
            {
              icon: ["la:dot-circle", "la:stop-circle"],
              title: "Screen recorder",
              className: ["", "text-red-500"],
              action: (ctx) => {
                const index = ctx.iconIndex + 1;
                const boundaries = ctx.og.icon.length;
                ctx.setIcon(boundaries === index ? 0 : index);

                setVideoType(ctx.og.title);
                toggleRecording();
              },
            },
            {
              icon: [
                "la:vr-cardboard",
                "la:play-circle-solid",
                "la:check-circle",
              ],
              title: "360 video",
              action: (ctx) => {
                const video = video360Ref.current?.video;

                // Change tab
                if (ctx.og.title !== videoType && !video) {
                  setVideoType(ctx.og.title);
                  ctx.setIcon(1);
                }

                if (ctx.og.title === videoType && video.paused) {
                  ctx.setIcon(2);
                  video.play();
                }

                // console.log(video360Ref.current.video.pause);

                // Change Icon
                // if (!isPlayingVideo) {
                //   const index = ctx.iconIndex + 1;
                //   // const boundaries = ctx.og.icon.length;
                //   ctx.setIcon(index);
                // }

                // In 360 view
                // if (ctx.og.title === videoType && video.pause) {
                //   console.log(video360Ref.current.video);
                //   setPlayingVideo(true);
                // }
              },
            },
          ]}
        />
      </div>
    </>
  );
};
