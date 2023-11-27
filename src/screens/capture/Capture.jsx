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
import { formatTimestamp } from "@/lib/utils";
import { FFmpeg } from "@ffmpeg/ffmpeg";

export const CaptureScreen = () => {
  // Hooks
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const params = useQueryParams();
  const { user } = useUser();
  const { videos, saveVideo: saveVideoIDB } = useIndexedDBVideos("local-unlisted-videos", 1);

  // State
  const [isScreenRecording, setIsScreenRecording] = React.useState(false);
  const [devices, setDevices] = React.useState({ audio: [], video: [] });
  const [screenDevice, setScreenDevice] = React.useState("");
  const [audioDevice, setAudioDevice] = React.useState("");
  const [isUploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [volumeDisplay, setVolumeDisplay] = React.useState(0);
  const [timelapsed, setTimeLapsed] = React.useState(0);
  const [recordedAudio, setRecordedAudio] = React.useState();
  const [recordedVideo, setRecordedVideo] = React.useState();

  // Refs
  const webcamRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const mainRef = React.useRef();
  const streamRef = React.useRef();
  const audioRecorderRef = React.useRef();
  const videoRecorderRef = React.useRef();
  const ffmpegRef = React.useRef(new FFmpeg());

  // TODO: handle new devices without refreshes
  // Detects all audio and video devices and populates
  const handleDevices = React.useCallback(
    (mediaDevices) => {
      const devicesList = { audio: [], video: [] };
      mediaDevices.forEach((device) => {
        if (device.kind === "videoinput") devicesList.video.push(device);
        if (device.kind === "audioinput") devicesList.audio.push(device);
      });
      setDevices(devicesList);
      setScreenDevice(devicesList.video[0].deviceId);
      setAudioDevice(devicesList.audio[0].deviceId);
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

  // Populates available devices
  React.useEffect(() => {
    // TODO: Not supported on Safari
    // (async () => {
    //   const { state: microphonePermission } = await navigator.permissions.query({ name: "microphone" });
    //   const { state: cameraPermission } = await navigator.permissions.query({ name: "camera" });
    //   const devices = await navigator.mediaDevices.enumerateDevices();
    //   handleDevices(devices);
    // })();

    navigator.mediaDevices
      // ! This is only for asking user for permission. Don't change
      .getUserMedia({ video: { width: 1920, height: 1080, aspectRatio: 16 / 9 }, audio: true })
      .then((stream) => navigator.mediaDevices.enumerateDevices())
      .then(handleDevices);
  }, [handleDevices]);

  // Handles input device (audio/video) change
  React.useEffect(() => {
    if (!!screenDevice.length || !!audioDevice.length)
      startScreen(screenDevice, audioDevice).catch((e) => {
        setScreenDevice("");
      });

    // TODO: Clean tracks
    // return () => {
    //   // canvasRef.current = null;
    //   if (webcamRef.current?.srcObject) webcamRef.current.srcObject.getTracks().forEach((track) => track.stop());
    //   if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    // };
  }, [screenDevice, audioDevice]);

  // Handles time lapsed
  React.useEffect(() => {
    let instance;
    if (isScreenRecording) {
      instance = setInterval(() => {
        setTimeLapsed((prev) => prev + 1000);
      }, 1000);
    }

    if (timelapsed !== 0 && !isScreenRecording) setTimeLapsed(0);

    return () => {
      clearInterval(instance);
    };
  }, [isScreenRecording]);

  // Observer for the media recorded
  React.useEffect(() => {
    if (recordedAudio && recordedVideo) handleRecordedVideo(recordedVideo, recordedAudio);
  }, [recordedAudio, recordedVideo]);

  const handleRecordedVideo = async (video, audio) => {
    setUploading(true);

    // TODO: MAYBE/? Change to send this as a stream to the data base so it can save it even faster without losing any info after done.
    const recordedVideo = new Blob([video.data, audio.data], { type: "video/mp4" });
    // const recordedAudio = new Blob([audio.data], { type: "audio/mp4" });

    // const videoSrc = URL.createObjectURL(recordedVideo);
    // window.open(videoSrc);

    const request = await saveVideoIDB(recordedVideo);

    request.onsuccess = ({ target }) => {
      navigate({ pathname: `preview`, search: createSearchParams({ id: target.result }).toString() });
    };
  };

  const startRecording = async () => {
    if (!isScreenRecording && !!screenDevice.length && !!audioDevice.length) {
      // Define Inputs
      const video = mainRef.current.captureStream();
      const audio = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: audioDevice } });

      // Generate combined stream
      const videoRecorder = new MediaRecorder(video);
      const audioRecorder = new MediaRecorder(audio);
      videoRecorderRef.current = videoRecorder;
      audioRecorderRef.current = audioRecorder;

      // Start recording
      videoRecorder.start();
      audioRecorder.start();
      setIsScreenRecording(true);

      // Video stopped
      audioRecorder.addEventListener("dataavailable", setRecordedAudio);
      videoRecorder.addEventListener("dataavailable", setRecordedVideo); // Video was stopped
      // videoRecorder.addEventListener("dataavailable", handleRecordedVideo); // Video was stopped
    }
    if (isScreenRecording) {
      setIsScreenRecording(false);
      videoRecorderRef.current.stop();
      audioRecorderRef.current.stop();
    }
  };

  const startScreen = async (deviceId, audioDeviceId) => {
    const config = { video: { width: 1920, height: 1080, deviceId }, audio: false };
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

    // Shows audio input levels
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

    main.srcObject = deviceId ? stream : null;
    streamRef.current = stream;
    // TODO : fix this for facing mode
    // main.style.transform = !isDisplayMedia ? "scaleX(-1)" : "scaleX(1)";
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
                {/* Video input */}
                <Select value={screenDevice} onValueChange={(value) => setScreenDevice(value !== "none" ? value : "")}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <div className="truncate">
                      <SelectValue placeholder="Select Screen Device" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Screen Recording">Screen Recorder</SelectItem>
                    {devices.video.map(({ deviceId, label }) => {
                      if (!label) return "";
                      return (
                        <SelectItem key={deviceId} value={deviceId}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {/* Audio input */}
                <Select value={audioDevice} onValueChange={(value) => setAudioDevice(value !== "none" ? value : "")}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <div className="truncate">
                      <SelectValue placeholder="Select Audio Device" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {devices.audio.map(({ deviceId, label }) => {
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
                {true && (
                  <>
                    <div className="rounded-xl p-1 px-6 bg-blue-600 text-center">
                      <Typography variant="large">{formatTimestamp(timelapsed)}</Typography>
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
