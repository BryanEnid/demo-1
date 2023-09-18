// CameraScreen.js
import React from "react";
import { Box, Button, Grid, IconButton } from "@mui/material";

import {
  AccessAlarm,
  Cameraswitch,
  PhotoLibrary,
  PictureInPicture,
} from "@mui/icons-material";

import Webcam from "react-webcam";
import { ObserveIcon } from "../../components/ObserveIcon";

export const CameraScreen = () => {
  const videoRef = React.useRef();
  const fileInputRef = React.useRef();
  const isFrontCamera = React.useState(true);
  const cameraPosition = React.useMemo(
    () => (isFrontCamera ? "user" : "environment"),
    [isFrontCamera]
  );

  const handleSelectedPictures = () => {};

  return (
    <Box sx={{ overflow: "hidden" }}>
      <Webcam
        mirrored
        videoConstraints={{
          height: window.innerHeight,
          width: window.innerWidth,
          facingMode: cameraPosition.current,
        }}
        height={window.innerHeight}
        width={window.innerWidth}
      />

      {/* Input API */}
      <>
        <input
          ref={fileInputRef}
          hidden
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={handleSelectedPictures}
        />
      </>

      {/* Overlay */}
      <>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            flex: 1,
            height: window.innerHeight,
            width: window.innerWidth,
          }}
        >
          <Grid
            container
            sx={{
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Box>
              <IconButton
                style={{ border: "none", backgroundColor: "transparent" }}
              >
                <ObserveIcon rounded size={80} />
              </IconButton>
            </Box>

            <Grid container flexDirection="row" justifyContent={"space-evenly"}>
              <Grid item>
                <IconButton size="large" sx={{ color: "white" }}>
                  <AccessAlarm sx={{ width: 40, height: 40 }} />
                </IconButton>
              </Grid>

              <Grid item>
                <IconButton
                  size="large"
                  sx={{ color: "white" }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <PhotoLibrary sx={{ width: 40, height: 40 }} />
                </IconButton>
              </Grid>

              <Grid item>
                <IconButton size="large" sx={{ color: "white" }}>
                  <Cameraswitch sx={{ width: 40, height: 40 }} />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </>
    </Box>
  );
};
