import React, { useState } from "react";
import Webcam from "react-webcam";
import reactLogo from "../../assets/react.svg";
import viteLogo from "/vite.svg";
import "./Landpage.css";

export const Landpage = () => {
  const [count, setCount] = useState(0);
  const webcamRef = React.useRef(null);
  const videoRef = React.useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(error);
    }
  };

  return (
    <>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p> */}
      asd
      <video ref={videoRef} autoPlay playsInline muted />
      <button onClick={startCamera}>Start Camera</button>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
    </>
  );
};
