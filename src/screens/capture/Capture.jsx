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
import { useUser } from "@/hooks/useUser";
import { Progress } from "@/chadcn/Progress";
import { useIndexedDBVideos } from "@/hooks/useIndexedDBVideos";

export const CaptureScreen = () => {
  // Hooks
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const params = useQueryParams();
  const { user } = useUser();
  const { videos, saveVideo: saveVideoIDB } = useIndexedDBVideos("local-unlisted-videos", 1);

  const [isScreenRecording, setIsScreenRecording] = React.useState(false);
  const [devices, setDevices] = React.useState([]);
  const [screenDevice, setScreenDevice] = React.useState("");
  const [isUploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [volumeDisplay, setVolumeDisplay] = React.useState(0);

  const webcamRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const mainRef = React.useRef();
  const recorderRef = React.useRef(null);
  const streamRef = React.useRef();

  // TODO: handle new devices without refreshes
  const handleDevices = React.useCallback(
    (mediaDevices) => {
      const devicesList = mediaDevices.filter(({ kind }) => kind === "videoinput");
      setDevices(devicesList);
      setScreenDevice(devicesList[0].deviceId);
    },
    [setDevices]
  );

  // Stop tracks when leaving to another screen
  React.useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [pathname]);

  React.useEffect(() => {
    // TODO: Not supported on Safari
    // (async () => {
    //   const { state: microphonePermission } = await navigator.permissions.query({ name: "microphone" });
    //   const { state: cameraPermission } = await navigator.permissions.query({ name: "camera" });
    //   const devices = await navigator.mediaDevices.enumerateDevices();
    //   handleDevices(devices);
    // })();

    navigator.mediaDevices
      // ! It only ask for permission
      .getUserMedia({ video: { width: 1920, height: 1080, aspectRatio: 16 / 9 }, audio: true })
      .then((stream) => navigator.mediaDevices.enumerateDevices())
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

    // TODO: MAYBE/? Change to send this as a stream to the data base so it can save it even faster without losing any info after done.
    const recordedVideo = new Blob([e.data], { type: "video/mp4" });

    const request = await saveVideoIDB(recordedVideo);

    request.onsuccess = ({ target }) => {
      navigate({ pathname: `preview`, search: createSearchParams({ id: target.result }).toString() });
    };
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
    const config = { video: { width: 1920, height: 1080, deviceId }, audio: true };
    const main = mainRef.current;

    // Set default config depending on the media source
    const isDisplayMedia = deviceId === "Screen Recording";
    const mediaStore = {
      getDisplayMedia: async (props) => navigator.mediaDevices.getDisplayMedia({ ...props }),
      getUserMedia: async (props) => navigator.mediaDevices.getUserMedia({ ...props }),
    };
    const stream = await mediaStore[isDisplayMedia ? "getDisplayMedia" : "getUserMedia"](config);

    stream.getTracks().forEach((track) => {
      track.onended = (evt) => {
        if (isScreenRecording) startRecording();
        setScreenDevice("");
        mainRef.current = null;
      };
    });

    // ! Vercel breaks with this code. I think it related how the app gets build
    // const audioContext = new AudioContext();
    // await audioContext.audioWorklet.addModule("/src/screens/capture/audio-worklet-processor.js"); // Replace with your actual path
    // const source = audioContext.createMediaStreamSource(stream);
    // const processor = new AudioWorkletNode(audioContext, "vumeter");

    // processor.port.onmessage = (event) => {
    //   if (event.data.type === "audioData") {
    //     const { average } = event.data.data;
    //     const volume = 1 + average * 8;
    //     const max_cap = 1.6;
    //     setVolumeDisplay(volume > max_cap ? max_cap : volume);
    //   }
    // };

    // source.connect(processor).connect(audioContext.destination);

    console.log(deviceId);
    main.srcObject = deviceId ? stream : null;
    streamRef.current = stream;
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

        <div className="w-screen flex justify-center relative">
          <div
            className="flex justify-center items-center max-w-screen-2xl bg-gray-700 rounded-3xl overflow-hidden"
            style={{ width: "100%", maxWidth: "calc(85vh * 16/9)" }}
          >
            {/* TODO ! –  */}
            {/* <canvas ref={canvasRef} width={1920} height={1080} className="w-full h-full" /> */}
            <video
              muted
              ref={mainRef}
              autoPlay
              controls={false}
              width={1920}
              height={1080}
              className={`h-[1080px] max-w-[1920px] ${screenDevice === "Screen Recording" && "opacity-0"}`}
            />
            {screenDevice === "Screen Recording" && (
              <div className="absolute text-white">
                <Typography variant="large">You are screen recording ...</Typography>
              </div>
            )}
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
              <div className="flex flex-col items-center gap-2 text-white relative">
                {isScreenRecording && (
                  <>
                    <div className="rounded-xl p-1 px-6 bg-blue-600 text-center">
                      <Typography variant="large">2 : 00</Typography>
                    </div>

                    <div className="text-yellow-300 absolute -bottom-8">
                      <Typography variant="small">Recording ...</Typography>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Overlay */}
          <div className="absolute flex flex-row justify-center">
            <div className="flex flex-row gap-16 text-4xl text-white">
              <div>
                <div className="relative">
                  <button className="rounded-full p-3 bg-blue-600 relative z-10 scale-95">
                    <Icon icon="ph:microphone-bold" />
                  </button>

                  <div
                    style={{ transform: `scale(${volumeDisplay})`, transition: "transform 0.1s linear" }}
                    className="absolute top-0 left-0 w-full h-full bg-blue-400 rounded-full"
                  />
                </div>
              </div>

              {/* <button className="rounded-full p-3 bg-blue-600">
                <Icon icon="majesticons:video" />
              </button> */}

              {/* <button className="rounded-full p-3 bg-white text-black">
                <Icon icon="iconamoon:restart" />
              </button> */}

              {/* <button className="rounded-full p-3">Pause</button> */}

              {!isUploading ? (
                <button onClick={startRecording} className="flex rounded-full p-3 bg-[#E87259] relative justify-center items-center">
                  {/* <Icon icon="fluent:record-stop-48-filled" /> */}
                  <Icon icon={!isScreenRecording ? "fluent:record-48-filled" : "fluent:record-stop-48-filled"} className="z-10" />
                  {isScreenRecording && <div className="animate-ping absolute inline-flex h-5/6 w-5/6 rounded-full bg-red-400 opacity-75 z-0" />}
                  {/* <div className="absolute bottom-[-50px] flex flex-row gap-4 text-xl">
                <button className="bg-slate-600 rounded-full p-2 px-3">3s</button>
                <button className="bg-slate-600 rounded-full p-2 px-3">10s</button>
              </div> */}
                </button>
              ) : (
                <div className="flex rounded-full p-2 bg-white relative justify-center items-center text-primary">
                  <Icon width={45} icon="line-md:uploading-loop" />

                  <div className="absolute bottom-[-60px] flex flex-row text-sm">
                    <div className="flex flex-col gap-1 font-medium justify-center items-center bg-white rounded-full p-2 px-6">
                      <div className="flex flex-row truncate gap-2">{uploadProgress}% Uploading ...</div>

                      {/* <Progress className="border" value={uploadProgress} /> */}
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
