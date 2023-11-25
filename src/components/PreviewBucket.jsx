import React from "react";
import { Button } from "@/chadcn/Button";
import { Typography } from "@/chadcn/Typography";
import { PageModal } from "@/components/PageModal";

import { Icon } from "@iconify/react";
import { Textarea } from "@/chadcn/Textarea";
import { Input } from "@/chadcn/Input";
import { useCollection } from "@/hooks/useCollection";
import { createSearchParams, useNavigate } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import { useProfile } from "@/hooks/useProfile";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { useUser } from "@/hooks/useUser";
import { Dialog } from "@/chadcn/Dialog";
import { VideoUploadButton } from "./VideoUploadButton";
import { Progress } from "@/chadcn/Progress";
import { cn, generatePreview, generateRandomNumber } from "@/lib/utils";
import { CircularProgress } from "./CircularProgress";
import { CachedVideo } from "./CachedVideo";

export const PreviewBucket = ({ show, onClose, data: inData, editMode, documentId }) => {
  // Hooks
  const { data: profile, isUserProfile } = useProfile();
  // const { data: user } = useUser();
  const navigate = useNavigate();
  const { createDocument, deleteDocument, updateDocument, uploadFile, uploadResumableFile, appendVideo } = useCollection("buckets");

  // State
  const [isEditMode, setEditMode] = React.useState(editMode ?? false);
  const [isUploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(20);
  const [currentVideo, setCurrentVideo] = React.useState(0);
  const [enableDelete, setEnableDelete] = React.useState(false);
  const [files, setFiles] = React.useState(null);
  const [state, setState] = React.useState([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [data, setData] = React.useState({
    videos: [],
    name: "",
    title: "",
    description: "",
  });

  // Refs
  const dropZoneRef = React.useRef();
  const videoRef = React.useRef();

  React.useEffect(() => {
    if (inData) {
      setData(inData);
      setState(inData.videos);
    }
  }, [inData]);

  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    // if (!isFullscreen) {
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.mozRequestFullScreen) {
      videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) {
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) {
      videoElement.msRequestFullscreen();
    }

    // Toggle the fullscreen state
    setIsFullscreen(!isFullscreen);
  };

  const handleNextVideo = () => {
    if (!(currentVideo === data.videos.length - 1)) return setCurrentVideo(currentVideo + 1);

    return setCurrentVideo(0);
  };

  const handleExit = (...props) => {
    setCurrentVideo(0);
    onClose(...props);

    if (editMode) {
      setTimeout(() => {
        setData({
          videos: [],
          name: "",
          title: "",
          description: "",
        });
        setEditMode(true);
      }, 1000);
    } else {
      setTimeout(() => {
        setEditMode(false);
      }, 500);
    }
  };

  const handleToCaptureScreen = (dbid) => {
    return navigate({ pathname: "/capture", search: createSearchParams({ bucketid: dbid }).toString() });
  };

  const handleCreateBucket = (params) => {
    const { willRedirect = false, cb = () => {}, onSuccess = () => {} } = params;
    const crudFunction = documentId ? updateDocument : createDocument;

    crudFunction(
      { data, documentId },
      {
        onSuccess: (dbid) => {
          if (willRedirect) handleToCaptureScreen(documentId);
          if (onSuccess) return onSuccess(dbid);
        },
        onSettled: cb(),
      }
    );
  };

  const handleSaveVideos = (files = []) => {
    setEditMode(true);

    handleCreateBucket({
      onSuccess: (dbid) => {
        const body = new Array(files.length)
          .fill({})
          .map((_, index) => ({ isUploading: true, progress: 0, index: data.videos.length + index, file: files.item(index) }));

        setData((prev) => ({ ...prev, videos: [...prev.videos, ...body] }));

        for (const item of body) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(item.file);
          reader.onload = () => saveVideo({ result: reader.result, details: { ...item, documentId: dbid } }, item.index);
        }
      },
    });
  };

  const saveVideo = async (file, index) => {
    try {
      const dbid = documentId ? documentId : file.details.documentId;
      setUploading(true);
      const recordedVideo = new Blob([file.result], { type: "video/mp4" });

      const preview = await generatePreview(recordedVideo);
      const imageUrl = await uploadFile({ file: preview, fileType: "image" });
      const { uploadTask, getDownloadURL } = await uploadResumableFile({ file: recordedVideo, fileType: "video" });

      // uploadTask.on("state_changed", (snapshot) => {
      //   setProgress(Math.ceil((snapshot.bytesTransferred * 100) / snapshot.totalBytes));
      // });

      // When finish uploading
      uploadTask.then(() => {
        getDownloadURL().then((videoUrl) => {
          // if bucket id -> save it to that bucket id
          // otherwise set it to unlisted
          // for now dont save it
          if (dbid) {
            appendVideo(
              { videoData: { image: imageUrl, videoUrl: videoUrl }, documentId: dbid },
              {
                onSuccess: () => {
                  // const videos = [...data.videos];
                  // videos[index] = { image: imageUrl, videoUrl: videoUrl };
                  // setData((prev) => ({ ...prev, videos }));
                  // navigate({ pathname: `/profile`, search: createSearchParams({ focus: selectedBucket.id }).toString() });
                },
                onError: (e) => console.log("appendVideo", e),
                onSettled: () => {
                  setUploading(false);
                  setProgress(0);
                },
              }
            );
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Check if a file is selected
    if (file) {
      // Check if the selected file is a video
      if (file.type.startsWith("video/")) {
        setSelectedVideo(file);
        onUpload(file);
      } else {
        alert("Please select a valid video file.");
      }
    }
  };

  const handleDeleteBucket = () => {
    deleteDocument(documentId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!e.dataTransfer.files.length > 0) return;

    const files = e.dataTransfer.files;

    // Check if the dropped file is a video
    for (const item of files) {
      if (!item.type.startsWith("video/")) return alert("Please drop a valid video file.");
    }

    handleSaveVideos(files);
  };

  const handleClose = () => {
    setEditMode(false);
    onClose();
    clear();
  };

  const clear = () => {
    if (editMode) {
      setData({
        videos: [],
        name: "",
        title: "",
        description: "",
      });
    }
  };

  if (isEditMode)
    return (
      <PageModal show={show} onClose={handleExit}>
        <div>
          {/* Video Player */}
          <div className="aspect-[16/9] shadow bg-black">
            <div className="w-full h-full backdrop-blur-md">
              <video
                autoPlay
                controls={false}
                ref={videoRef}
                src={data.videos[currentVideo]?.videoUrl} // Have also low quality videos
                onEnded={handleNextVideo}
                type="video/mp4"
                className="w-full h-full object-center rounded-none z-10"
              />
            </div>
          </div>
          <div className="flex flex-row  px-8 my-6">
            <div className="flex basis-2/12 flex-col items-center gap-2 justify-center">
              {/* TODO: picture */}
              <img src={profile?.photoURL} className="rounded-full object-cover w-20" />
              <Typography variant="small">215k</Typography>
            </div>

            <div className="flex basis-10/12 flex-col w-full gap-8 pl-4 pb-4">
              <div className="flex flex-row justify-between items-center">
                <div>
                  <Typography variant="large">{profile?.name}</Typography>
                  {/* <Typography variant="small">{profile?.role}</Typography> */}
                </div>
                <div>
                  <Button
                    variant="secondary"
                    onClick={() => handleCreateBucket({ cb: () => onClose() })}
                    disabled={![data.description.length, data.title.length].every(Boolean)}
                  >
                    {isEditMode ? (editMode ? "Create bucket" : "Done editing") : "Edit Bucket"}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {isEditMode && (
                  <Input
                    value={data.name}
                    placeholder="Bucket name"
                    onChange={({ target }) => setData((prev) => ({ ...prev, name: target.value }))}
                    className="bg-white/10"
                  />
                )}

                <Input
                  value={data.title}
                  placeholder="Title"
                  onChange={({ target }) => setData((prev) => ({ ...prev, title: target.value }))}
                  className="bg-white/10"
                />
                <Textarea
                  value={data.description}
                  placeholder="Description"
                  onChange={({ target }) => setData((prev) => ({ ...prev, description: target.value }))}
                  className="bg-white/10 min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* TODO: Fix overflow hidden */}
          {/* <div className="h-10" /> */}

          {!editMode && (
            <div>
              <div className="flex gap-3 px-2 py-2 rounded-md bg-gray-200 scale-90">
                <Button
                  iconBegin={<Icon icon="humbleicons:camera-video" />}
                  variant="secondary"
                  onClick={() => handleCreateBucket({ willRedirect: true })}
                  disabled={![data.description.length, data.title.length].every(Boolean)}
                >
                  Capture
                </Button>
                <VideoUploadButton onUpload={handleSaveVideos} disabled={![data.description.length, data.title.length].every(Boolean)} />
              </div>

              <div className="text-center text-black/50 mt-8">
                <Typography variant="small">Drag and drop your videos below</Typography>
              </div>

              {/* <div className="flex justify-center items-center my-6 mt-6"> */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ transition: "0.5s" }}
                className={["border-dashed border border-black/30 rounded-lg p-4 m-6 transition relative overflow-hidden", isDragOver && "bg-primary"].join(
                  " "
                )}
              >
                {isUploading && <Progress value={progress} color="bg-primary" className="bg-blue-100 absolute w-full left-0 top-0" />}
                <ReactSortable
                  className="flex flex-wrap justify-between w-full relative"
                  list={data.videos}
                  setList={(state) => setData((prev) => ({ ...prev, videos: state }))}
                  onChoose={() => setEnableDelete(true)}
                  onEnd={() => setEnableDelete(false)}
                  onRemove={console.log}
                  group="1"
                  animation={500}
                  delayOnTouchStart={true}
                  delay={0}
                  draggable=".draggable"
                  filter=".undraggable"
                  ghostClass="opacity-0"
                  // selectedClass="scale-150"
                >
                  {[...data.videos, ...new Array(12 - data?.videos?.length).fill("")].map((item, index) => {
                    if (item?.image) {
                      return (
                        <div key={item.image} className="draggable w-1/4 h-full aspect-video p-2 flex justify-center items-center">
                          <img
                            src={item.image}
                            className="animate-wiggle rounded-lg object-cover select-none h-full aspect-video"
                            // style={{ userDrag: "none" }}
                          />
                        </div>
                      );
                    }

                    if (item?.isUploading) {
                      return (
                        <div key={index + 1} className="undraggable w-1/4 aspect-video p-3">
                          <div className="flex h-full rounded-lg object-cover border-dashed border border-black/10 justify-center items-center text-3xl text-black/20">
                            <div className="relative">
                              <Icon icon="line-md:uploading-loop" fontSize={60} />
                              {/* <Typography variant="small">{item?.progress}%</Typography> */}
                              {/* <Progress value={item?.progress} color="bg-primary" className="bg-blue-100 mt-4 absolute -bottom-4 scale-50" /> */}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={index + 1} className="undraggable w-1/4 aspect-video p-3">
                        <div className=" flex h-full rounded-lg object-cover border-dashed border border-black/10 justify-center items-center text-3xl text-black/20">
                          <div className="relative text-center">
                            <Typography>{index + 1}</Typography>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </ReactSortable>
                {/* </div> */}
              </div>

              {enableDelete && (
                <div className="flex justify-center items-center relative ">
                  <ReactSortable
                    className="border-dashed border border-white/30 rounded-3xl p-4 m-6 relative overflow-hidden bg-red-300 min-w-[50px] min-h-[50px] max-w-[380px] max-h-[200px]"
                    group="1"
                    list={[]}
                    setList={() => {}}
                    delayOnTouchStart={true}
                  ></ReactSortable>

                  <div className="absolute text-white ">
                    <Icon fontSize={30} icon="fluent:delete-12-regular" />
                  </div>
                </div>
              )}
              <div className="h-[50px]" />
            </div>
          )}

          <div className="flex justify-end flex-row text-center text-white/50 px-8 my-8  gap-3">
            <Button
              variant="secondary"
              onClick={handleClose}
              // disabled={![data.description.length, data.title.length].every(Boolean)}
              className="w-full max-w-[150px]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleCreateBucket({ cb: handleClose })}
              disabled={![data.description.length, data.title.length].every(Boolean)}
              className="w-full max-w-[200px]"
            >
              Save
            </Button>
          </div>
        </div>
      </PageModal>
    );

  return (
    <PageModal show={show} onClose={handleExit}>
      {/* Video Player */}
      <div className="aspect-[16/9] shadow bg-black">
        <div className="w-full h-full backdrop-blur-md">
          <CachedVideo
            autoPlay
            controls={false}
            ref={videoRef}
            src={data.videos[currentVideo]?.videoUrl} // Have also low quality videos
            onEnded={handleNextVideo}
            className="w-full h-full object-center rounded-none z-10"
          />

          <div className="transition cursor-pointer absolute top-2 right-4 p-1 rounded-md bg-slate-300/20 backdrop-blur-sm border-white border hover:bg-slate-300/50">
            <Icon onClick={toggleFullscreen} className="text-3xl text-white" icon="iconamoon:screen-full-duotone" />
          </div>
        </div>
      </div>
      <div className="flex flex-row h-48 px-8 my-6">
        <div className="flex basis-2/12 flex-col items-center gap-2 justify-center">
          <img src={profile.photoURL} className="rounded-full object-cover w-20" />
          <Typography variant="small">215k</Typography>
          <Button variant="secondary">Anchor</Button>
        </div>

        <div className="flex basis-10/12 flex-col w-full gap-8 pl-4 pb-4">
          <div className="flex flex-row justify-between items-center">
            <div>
              <Typography variant="large">{profile.name}</Typography>
              {/* <Typography variant="small">{profile.role}</Typography> */}
            </div>
            {isUserProfile && (
              <div className="flex gap-3 items-center">
                <Button iconBegin={<Icon icon="humbleicons:camera-video" />} variant="secondary" onClick={() => handleCreateBucket({ willRedirect: true })}>
                  Capture
                </Button>

                <VideoUploadButton onUpload={handleSaveVideos} />

                <Button variant="secondary" onClick={() => setEditMode(true)}>
                  Edit
                </Button>
              </div>
            )}
          </div>

          <div>
            <div>
              <Typography variant="large">{data.title}</Typography>
              <Typography variant="small">{data.description}</Typography>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center my-6 mt-10">
        <div className="grid grid-cols-4 gap-5">
          {data.videos.map(({ image }, index) => {
            if (image)
              return (
                <button onClick={() => setCurrentVideo(index)}>
                  <div key={image}>
                    {/* <img src={image} className="rounded-lg object-cover w-40 h-28" /> */}
                    <LazyLoadImage
                      className={cn(
                        "rounded-lg object-cover w-40 h-28 transition-all border-transparent border-[4px]",
                        currentVideo === index && "border-primary scale-110"
                      )}
                      // alt={image.alt}
                      // height={image.height}
                      src={image} // use normal <img> attributes as props
                      // width={image.width}
                    />
                  </div>
                </button>
              );
          })}
        </div>
      </div>
    </PageModal>
  );
};
