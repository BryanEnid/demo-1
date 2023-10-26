import React from "react";
import { AspectRatio } from "@/chadcn/AspectRatio";
import { Button } from "@/chadcn/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/chadcn/Select";
import { Icon } from "@iconify/react";
import { Typography } from "@/chadcn/Typography";
import { useCollection } from "@/hooks/useCollection";
import { createSearchParams, useLocation, useNavigate, useParams, useRoutes } from "react-router-dom";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Modal } from "@/components/Modal";

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export const CaptureScreen = () => {
  const navigate = useNavigate();
  const params = useQueryParams();

  const [isScreenRecording, setIsScreenRecording] = React.useState(false);
  const [devices, setDevices] = React.useState([]);
  const [screenDevice, setScreenDevice] = React.useState("");
  const [isUploading, setUploading] = React.useState(false);
  const [bucketId, setBucketId] = React.useState(null);

  const webcamRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const mainRef = React.useRef();
  const recorderRef = React.useRef(null);

  const { uploadFile, appendVideo, data } = useCollection("buckets");

  // TODO: handle new devices without refreshes
  const handleDevices = React.useCallback(
    (mediaDevices) => {
      const devicesList = mediaDevices.filter(({ kind }) => kind === "videoinput");
      setDevices(devicesList);
      setScreenDevice(devicesList[0].deviceId);
    },
    [setDevices]
  );

  React.useEffect(() => {
    params?.bucketid && setBucketId(params.bucketid);
  }, [params.bucketid]);

  React.useEffect(() => {
    navigator.mediaDevices
      // Ask for permission
      .getUserMedia({ video: { width: 1920, height: 1080, aspectRatio: 16 / 9 }, audio: true })
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then(handleDevices);
  }, [handleDevices]);

  React.useEffect(() => {
    if (!!screenDevice.length) startScreen(screenDevice);

    return () => {
      // canvasRef.current = null;
      if (webcamRef.current?.srcObject) webcamRef.current.srcObject.getTracks().forEach((track) => track.stop());
      if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    };
  }, [screenDevice]);

  const handleRecordedVideo = async (e) => {
    setUploading(true);

    // TODO: Change to send this directly to the data base so it can save it even faster without losing any info after done.
    const recordedVideo = new Blob([e.data], { type: "video/mp4" });
    const preview = await generatePreview(recordedVideo);
    const previewUrl = await uploadFile(preview, "image");
    const videoUrl = await uploadFile(recordedVideo, "video");

    // Select bucket to upload

    // if bucket id -> save it to that bucket id
    // otherwise set it to unlisted
    // for now dont save it
    if (params.bucketid) {
      appendVideo({ image: previewUrl, videoUrl: videoUrl }, params.bucketid)
        .then((documentId) => {
          setUploading(false);
          navigate({ pathname: "/profile", search: createSearchParams({ focus: documentId }).toString() });
        })
        .finally(() => {
          if (isUploading) setUploading(false);
        });
    }
  };

  const generatePreview = async (recordedVideo) => {
    try {
      const videoUrl = URL.createObjectURL(recordedVideo);

      const videoElement = document.createElement("video");
      videoElement.src = videoUrl;
      document.body.appendChild(videoElement);

      await videoElement.play();

      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext("2d");

      // Draw the video frame onto the canvas
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Convert the canvas content to a data URL (screenshot)
      const screenshot = canvas.toDataURL("image/png");

      // Clean up elements
      document.body.removeChild(videoElement);
      URL.revokeObjectURL(videoUrl);

      // Convert the screenshot to a Blob
      const screenshotBlob = dataURItoBlob(screenshot);

      return screenshotBlob;
    } catch (err) {
      console.error("Error generating preview:", err);
      throw err;
    }
  };

  const startRecording = async () => {
    if (!isScreenRecording && !!screenDevice.length) {
      // Define Inputs
      const video = mainRef.current.captureStream();

      // Generate combined stream
      const recorder = new MediaRecorder(video);
      recorderRef.current = recorder;

      // Start recording
      console.log("recording started");
      recorder.start();
      setIsScreenRecording(true);

      // Video stopped
      recorder.addEventListener("dataavailable", handleRecordedVideo); // Video was stopped
    }
    if (isScreenRecording) {
      setIsScreenRecording(false);
      recorderRef.current.stop();
    }
  };

  // const stopRecording = () => {};

  const startScreen = async (deviceId) => {
    const config = { video: { width: 1920, height: 1080, aspectRatio: 16 / 9, deviceId }, audio: true };
    const main = mainRef.current;

    // Set default config depending on the media source
    const isDisplayMedia = deviceId === "Screen Recording";
    const mediaStore = {
      getDisplayMedia: async (props) => navigator.mediaDevices.getDisplayMedia({ ...props }),
      getUserMedia: async (props) => navigator.mediaDevices.getUserMedia({ ...props }),
    };
    const stream = await mediaStore[isDisplayMedia ? "getDisplayMedia" : "getUserMedia"](config);
    main.srcObject = stream;
    // TODO : fix this for facing mode
    // main.style.transform = !isDisplayMedia ? "scaleX(-1)" : "scaleX(1)";
  };

  const handleStartScreen = (value) => {
    setScreenDevice(value !== "none" ? value : "");
    startScreen();
  };

  return (
    <>
      {/* TODO: Replace this with https://www.figma.com/file/SmttzZOlFETqjtOu9vUixc/Observe?type=design&node-id=3231-4389&mode=dev */}
      {/* <Modal show>
        <div className="flex flex-col gap-4 max-w-2xl">
          {data.map((item) => {
            return (
              <button className="grid grid-cols-4 text-start border rounded-md py-4 px-8 gap-6 w-full">
                <div>
                  {item.videos?.[0]?.image ? (
                    <img className="object-cover aspect-square shadow drop-shadow-xl p-1 bg-white rounded-full" src={item.videos?.[0]?.image} />
                  ) : (
                    <div className="bg-black object-cover aspect-square shadow drop-shadow-xl p-1 rounded-full w-32" />
                  )}
                </div>

                <div className="col-span-3">
                  <Typography variant="large">{item.title}</Typography>
                  <Typography variant="small">{item.description}</Typography>
                </div>
              </button>
            );
          })}
        </div>
      </Modal> */}

      <div className="flex-inline pt-2 h-screen bg-[#001027]">
        {/* Resources */}
        <video ref={webcamRef} autoPlay className="h-full hidden" />
        <video ref={videoRef} autoPlay className="h-full hidden" />

        <div className="w-screen flex justify-center">
          <div
            className="flex justify-center items-center max-w-screen-2xl bg-white rounded-3xl overflow-hidden"
            style={{ width: "100%", maxWidth: "calc(85vh * 16/9)" }}
          >
            {/* TODO ! –  */}
            {/* <canvas ref={canvasRef} width={1920} height={1080} className="w-full h-full" /> */}
            <video muted ref={mainRef} autoPlay controls={false} width={1920} height={1080} className="w-full h-full" />
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center mt-10 w-full">
          <div className="flex flex-row justify-center w-full items-center">
            <div style={{ width: "100%", maxWidth: "calc(85vh * 16/9)" }} className="flex flex-row justify-between items-center">
              {/* Start */}
              <div className="flex flex-row gap-4">
                <Select value={screenDevice} onValueChange={handleStartScreen}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <div className="truncate">
                      <SelectValue placeholder="Select Screen Device" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Screen Recording">Screen Recorder</SelectItem>
                    {devices.map(({ deviceId, label }) => {
                      console.log({ deviceId, label });
                      if (!label) return "";
                      return (
                        <SelectItem key={deviceId} value={deviceId}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* End */}
              <div className="flex flex-col items-center gap-2 text-white">
                {/* <div className="rounded-xl p-1 px-6 bg-blue-600  text-center">
                <Typography variant="large">2 : 00</Typography>
              </div>

              <div className="text-yellow-300">
                <Typography variant="small">Recording ...</Typography>
              </div> */}
              </div>
            </div>
          </div>

          {/* Overlay */}
          <div className="absolute flex flex-row justify-center">
            <div className="flex flex-row gap-16 text-4xl text-white">
              <button className="rounded-full p-3 bg-blue-600">
                <Icon icon="ph:microphone-bold" />
              </button>

              <button className="rounded-full p-3 bg-blue-600">
                <Icon icon="majesticons:video" />
              </button>

              <button className="rounded-full p-3 bg-white text-black">
                <Icon icon="iconamoon:restart" />
              </button>

              {/* <button className="rounded-full p-3">Pause</button> */}

              {!isUploading ? (
                <button onClick={startRecording} className="flex rounded-full p-3 bg-[#E87259] relative justify-center">
                  {/* <Icon icon="fluent:record-stop-48-filled" /> */}
                  <Icon icon={!isScreenRecording ? "fluent:record-48-filled" : "fluent:record-stop-48-filled"} />
                  {/* <div className="absolute bottom-[-50px] flex flex-row gap-4 text-xl">
                <button className="bg-slate-600 rounded-full p-2 px-3">3s</button>
                <button className="bg-slate-600 rounded-full p-2 px-3">10s</button>
              </div> */}
                </button>
              ) : (
                <div className="flex rounded-full p-2 bg-white relative justify-center items-center text-primary">
                  <Icon width={45} icon="line-md:uploading-loop" />

                  <div className="absolute bottom-[-50px] flex flex-row text-sm">
                    <div className="font-medium flex flex-row truncate justify-center items-center gap-2 bg-white rounded-full p-2 px-3">
                      <Icon width={20} icon="line-md:loading-twotone-loop" /> Uploading ...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
