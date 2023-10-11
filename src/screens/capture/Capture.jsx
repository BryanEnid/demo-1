import React from "react";
import Webcam from "react-webcam";

import { NavBar } from "@/components/NavBar";
import { SideBar } from "@/components/SideBar";
import { DebugOverlay } from "@/components/DebugOverlay";

import { VR_3D, Video360 } from "@/components/MediaPlayer";
import { useOrientation } from "@/hooks/useOrientation";
import { useDeviceType } from "@/hooks/useDeviceType";

const CameraSize = 180;

export const CameraScreen = () => {
  // const { isPortrait } = useOrientation();
  const { isMobile } = useDeviceType();

  const [videoType, setVideoType] = React.useState("Screen recorder");
  const [stream, setStream] = React.useState(null);
  const [isScreenRecording, setScreenRecording] = React.useState(false);
  const [deviceId, setDeviceId] = React.useState();
  const [devices, setDevices] = React.useState([]);

  const video360Ref = React.useRef(null);
  const videoRef = React.useRef(null);
  const cameraRef = React.useRef(null);

  // Function to toggle PiP mode
  const togglePiP = () => {
    const videoElement = cameraRef.current.video;

    if (document.pictureInPictureElement === videoElement) {
      document.exitPictureInPicture();
    } else {
      videoElement.requestPictureInPicture();
    }
  };

  const handleDevices = React.useCallback(
    (mediaDevices) => {
      const devicesList = mediaDevices.filter(
        ({ kind }) => kind === "videoinput"
      );
      setDevices(devicesList);
      setDeviceId(devicesList[0].deviceId);
    },
    [setDevices]
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  const startRecording = async () => {
    setScreenRecording(true);

    const config = { video: true, audio: false };
    const stream = await navigator.mediaDevices.getDisplayMedia(config);
    setStream(stream);
    videoRef.current.srcObject = stream;

    // togglePiP();
  };

  const stopRecording = async () => {
    setScreenRecording(false);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null); // Reset the stream state
    }
  };

  const handle360Video = (ref, video) => {
    video360Ref.current = { ref, video };
  };

  const RenderMediaPlayer = React.useCallback(({ videoType }) => {
    switch (videoType) {
      case "Screen recorder":
        return (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-screen h-screen"
          />
        );

      case "360 video (VR)":
        return (
          <Video360
            onVideoReady={handle360Video}
            className="w-screen h-screen"
          />
        );

      case "3D (VR)":
        return <VR_3D className="w-screen h-screen" />;

      default:
        return <></>;
    }
  }, []);

  return (
    <>
      <div className="h-screen w-screen bg-slate-300">
        {/* Interface */}
        <>
          <div className="z-10">
            <RenderMediaPlayer videoType={videoType} />
          </div>

          {/* WebCam */}
          <div
            style={{ height: CameraSize, width: CameraSize }}
            className="flex absolute bottom-10 right-20 rounded-full items-center justify-center transparent"
          >
            <Webcam
              ref={cameraRef}
              mirrored
              videoConstraints={{
                height: CameraSize,
                width: CameraSize,
                deviceId: deviceId,
                // facingMode: cameraPosition.current,
              }}
              className="rounded-full z-10 opacity-0"
            />
          </div>
        </>

        {/* Overlay Actions */}
        <>
          {/* <NavBar /> */}

          <SideBar />

          {/* <DebugOverlay
            data={[
              {
                icon: ["ci:radio-fill", "ci:stop-circle"],
                title: "Screen recorder",
                className: ["", "text-red-500"],
                disabled: isMobile,
                action: (ctx) => {
                  // Reset all icons
                  ctx.siblings.forEach((item) => item.setIcon(0));

                  const index = ctx.iconIndex + 1;
                  const boundaries = ctx.this.icon.length;
                  ctx.setIcon(boundaries === index ? 0 : index);

                  setVideoType(ctx.this.title);
                  if (ctx.iconIndex === 0) {
                    startRecording().catch(() => {
                      ctx.setIcon(0);
                      togglePiP();
                    });
                    togglePiP();
                  }

                  if (ctx.iconIndex === 1) {
                    stopRecording();
                    togglePiP();
                  }
                },
              },

              {
                icon: ["material-symbols:pip-rounded"],
                title: "Picture in Picture",
                action: (ctx) => {
                  togglePiP();
                },
              },

              {
                icon: ["ci:devices"],
                title: "Camera devices",
                type: "dropdown",
                options: devices?.map(({ label, deviceId }) => ({
                  label: label,
                  value: deviceId,
                })),
                action: (ctx) => {
                  if (ctx.selected) setDeviceId(ctx.selected);
                },
                selected: deviceId,
              },

              {
                icon: ["iconoir:360-view", "ci:play", "ci:check-big"],
                title: "360 video (VR)",
                action: (ctx) => {
                  // Clear state
                  ctx.siblings.forEach(
                    (item) => item.title !== videoType && item.setIcon(0)
                  );
                  document.exitPictureInPicture();
                  stopRecording();

                  setVideoType(ctx.this.title);
                  const video = video360Ref.current?.video;

                  // Change tab
                  if (ctx.this.title !== videoType) ctx.setIcon(1);

                  if (ctx.this.title === videoType && video?.paused) {
                    video.play();
                    ctx.setIcon(2);
                  }
                },
              },

              {
                icon: ["iconamoon:3d"],
                title: "3D (VR)",
                action: (ctx) => {
                  // Clear state
                  ctx.siblings.forEach((item) => item.setIcon(0));
                  document.exitPictureInPicture();
                  stopRecording();

                  setVideoType(ctx.this.title);
                  const video = video360Ref.current?.video;

                  // Change tab
                  // if (ctx.this.title !== videoType) ctx.setIcon(1);

                  // if (ctx.this.title === videoType && video.paused) {
                  //   ctx.setIcon(2);
                  //   video.play();
                  // }
                },
              },
            ]}
          /> */}
        </>
      </div>
    </>
  );
};
