let canvas = null;
let stream = null;

// worker.js
self.onmessage = function (e) {
  if (e.data.action === "attach_canvas") canvasSetup(e);
  if (e.data.action === "render") render(e);
};

const canvasSetup = (e) => {
  // Canvas
  canvas = e.data.canvas;

  // Video
  // const videoElement = document.createElement("video");
  // videoElement.srcObject = e.data.stream;
  // videoElement.autoplay = true;
};

const render = (e) => {
  stream = new ImageData(e.data.frame, e.data.dimensions.videoWidth);
  drawScreen();

  // requestAnimationFrame(render);
};

const drawScreen = async () => {
  const videoWidth = stream.width;
  const videoHeight = stream.height;
  const videoAspectRatio = videoWidth / videoHeight;

  // Canvas
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const ctx = canvas.getContext("2d", { alpha: false });

  // ctx.scale(dpr, dpr);

  let destWidth = canvasWidth;
  let destHeight = canvasHeight;
  if (videoAspectRatio > 16 / 9) {
    destHeight = canvasWidth / videoAspectRatio;
  } else {
    destWidth = canvasHeight * videoAspectRatio;
  }

  const xOffset = (canvasWidth - destWidth) / 2;
  const yOffset = (canvasHeight - destHeight) / 2;

  // Draw the video to fit the canvas dimensions
  // canvas.style.width = destWidth;
  // canvas.style.height = destHeight;

  // ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  const imageBitmap = await createImageBitmap(stream);
  ctx.drawImage(imageBitmap, Math.floor(xOffset), Math.floor(yOffset), Math.floor(destWidth), Math.floor(destHeight));
};

// const drawCamera = () => {
//   const dpr = window.devicePixelRatio;
//   const canvasWidth = canvasRef.current.width;
//   const canvasHeight = canvasRef.current.height;
//   const cameraWidth = webcamRef.current.videoWidth * videoScale * dpr;
//   const cameraHeight = webcamRef.current.videoHeight * videoScale * dpr;
//   const tempCameraPosition = {
//     x: -cameraPosition.bottom * dpr + (canvasWidth - cameraWidth),
//     y: -cameraPosition.right * dpr + (canvasHeight - cameraHeight - 15),
//   };
//   const ctx = canvasRef.current.getContext("2d", { alpha: false });
//   ctx.scale(dpr, dpr);

//   ctx.save();

//   // Border
//   ctx.beginPath();
//   ctx.arc(
//     Math.floor(tempCameraPosition.x + cameraWidth / 2),
//     Math.floor(tempCameraPosition.y + cameraHeight / 2),
//     Math.floor(Math.min(cameraWidth, cameraHeight) / 2),
//     0,
//     Math.PI * 2
//   );
//   ctx.strokeStyle = "white";
//   ctx.lineWidth = 15;
//   ctx.stroke();

//   // Clip circular shape
//   ctx.beginPath();
//   ctx.arc(
//     Math.floor(tempCameraPosition.x + cameraWidth / 2),
//     Math.floor(tempCameraPosition.y + cameraHeight / 2),
//     Math.floor(Math.min(cameraWidth, cameraHeight) / 2),
//     0,
//     Math.PI * 2
//   );
//   ctx.clip();

//   // Camera to be clipped
//   ctx.drawImage(webcamRef.current, tempCameraPosition.x, tempCameraPosition.y, cameraWidth, cameraHeight);

//   ctx.restore();
// };

const record = () => {};
