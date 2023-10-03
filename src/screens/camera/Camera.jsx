import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";

import { Button } from "@/chadcn/Button";
import { NavBar } from "@/components/NavBar";
import { SideBar } from "@/components/SideBar";

const CameraSize = 180;

export const CameraScreen = () => {
  const [stream, setStream] = useState(null);
  const [isScreenRecording, setScreenRecording] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
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

  return (
    <div className="h-screen w-screen">
      <NavBar />

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-screen h-screen bg-slate-300"
      />

      {/* WebCam */}
      {isScreenRecording && stream && (
        <div
          style={{ height: CameraSize, width: CameraSize }}
          className="flex absolute bottom-10 right-20 rounded-full items-center justify-center bg-black border-2 border-red-400"
        >
          <Webcam
            mirrored
            videoConstraints={{
              height: CameraSize,
              width: CameraSize,
              // facingMode: cameraPosition.current,
            }}
            onUserMedia={console.log}
            className="rounded-full"
          />
        </div>
      )}

      {/* Overlay Actions */}
      <SideBar />

      <div className="fixed bottom-0">
        <Button
          variant={!isScreenRecording || !stream ? "outline" : "destructive"}
          onClick={toggleRecording}
        >
          {isScreenRecording && stream ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>
    </div>
  );
};
