import React from "react";
import "aframe";
import { Entity, Scene } from "aframe-react";
import videoasset from "../assets/360example.mp4";
import png from "@/assets/observe_logo_512.png";

export const Video360 = ({ className, onVideoReady }) => {
  const videoRef = React.useRef();
  const [isReady, setReady] = React.useState(null);

  React.useEffect(() => {
    const content =
      videoRef.current?.components?.material?.material?.map?.image;
    if (content) {
      setReady(true);
      onVideoReady(videoRef, content);
    }

    if (!content) setTimeout(() => setReady(false), 1000);
  }, [isReady]);

  return (
    // <Scene>
    //   <Entity
    //     geometry={{ primitive: "box", width: 1 }}
    //     material={{ roughness: 0.5, src: png }}
    //     scale={{ x: 2, y: 2, z: 2 }}
    //     position={{ x: 0, y: 0, z: -5 }}
    //   />

    //   <Entity
    //     geometry={{ primitive: "box", width: 1 }}
    //     material={{ roughness: 0.5, src: png }}
    //     scale={{ x: 2, y: 2, z: 2 }}
    //     position={{ x: 6, y: 0, z: -5 }}
    //   />
    // </Scene>
    <>
      <a-scene>
        <a-videosphere
          ref={videoRef}
          // rotation="-40 0 -88"
          rotation="0 180 0"
          src="#video"
        ></a-videosphere>

        <a-assets>
          <video
            id="video"
            style={{ display: "none" }}
            // autoplay
            loop
            // crossorigin="anonymous"
            // playsinline
            // webkit-playsinline
          >
            <source
              type="video/mp4"
              src="https://cdn.jsdelivr.net/gh/aframevr/assets@master/360-video-boilerplate/video/city.mp4"
            />
          </video>
        </a-assets>
      </a-scene>
    </>
  );
};
