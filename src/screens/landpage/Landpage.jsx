import React, { useState } from "react";
import Webcam from "react-webcam";
import "./Landpage.css";

export const Landpage = () => {
  const [count, setCount] = useState(0);
  const webcamRef = React.useRef(null);
  const videoRef = React.useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      // alert(error);
      console.error("Error accessing camera:", error);
    }
  };

  return (
    <>
      <button onClick={startCamera}>Start Camera</button>

      <video style={{ width: "100%" }} ref={videoRef} playsInline muted />

      {/* <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" /> */}
    </>
  );
};
