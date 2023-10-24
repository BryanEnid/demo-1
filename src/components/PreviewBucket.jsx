import React from "react";
import { Button } from "@/chadcn/Button";
import { Typography } from "@/chadcn/Typography";
import { PageModal } from "@/components/PageModal";
import { useUserData } from "@/hooks/useUserData";
import { Icon } from "@iconify/react";
import { Textarea } from "@/chadcn/Textarea";
import { Input } from "@/chadcn/Input";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { createSearchParams, useNavigate } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";

export const PreviewBucket = ({ show, onClose, data: inData, editMode, documentId }) => {
  // Hooks
  const { user } = useUserData();
  const navigate = useNavigate();
  const { addDocument, deleteDocument } = useFirestoreCollection("buckets");

  // State
  const [isEditMode, setEditMode] = React.useState(editMode ?? false);
  const [currentVideo, setCurrentVideo] = React.useState(0);
  const [files, setFiles] = React.useState(null);
  const [state, setState] = React.useState([]);
  const [data, setData] = React.useState({
    videos: [],
    name: "",
    title: "",
    description: "",
  });

  // const setVideos = (props) => {
  //   setData((prev) => ({ ...prev, videos: [...props] }));
  // };

  // Refs
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

  const handleCreateBucket = () => {
    addDocument(data, documentId).then((dbid) => {
      console.log(createSearchParams({ documentId: dbid }).toString());
      if (editMode) navigate({ pathname: "/capture", search: createSearchParams({ bucketid: dbid }).toString() });
    });

    setEditMode(false);
  };

  const handleDeleteBucket = () => {
    deleteDocument(documentId);
  };

  if (!user) return <></>;

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
                className="w-full h-full object-center rounded-none z-10"
              />
            </div>
          </div>
          <div className="text-white flex flex-row  px-8 my-6">
            <div className="flex basis-2/12 flex-col items-center gap-2 justify-center">
              <img src={user.picture.md} className="rounded-full object-cover w-20" />
              <Typography variant="small">215k</Typography>
            </div>

            <div className="flex basis-10/12 flex-col w-full gap-8 pl-4 pb-4">
              <div className="flex flex-row justify-between items-center">
                <div>
                  <Typography variant="large">{user.name}</Typography>
                  <Typography variant="small">{user.role}</Typography>
                </div>
                <div>
                  <Button variant="secondary" onClick={handleCreateBucket} disabled={![data.description.length, data.title.length].every(Boolean)}>
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

          <div className="text-center text-white/50 mt-8">
            <Typography variant="small">Drag and drop your videos below</Typography>
          </div>

          {/* <div className="flex justify-center items-center my-6 mt-6"> */}
          <div className="border-dashed border border-white/30 rounded-lg p-4 m-6">
            <ReactSortable
              className="w-full grid grid-cols-4 gap-5"
              list={data.videos}
              setList={(state) => setData((prev) => ({ ...prev, videos: state }))}
              animation={500}
              delayOnTouchStart={true}
              delay={0}
              draggable=".draggable"
              filter=".undraggable"
              ghostClass="opacity-0"
              // selectedClass="scale-150"
            >
              {[...data.videos, ...new Array(12 - data?.videos?.length).fill("")].map((data, index) => {
                if (data.image) {
                  return (
                    <div key={data.image} className="draggable">
                      <img
                        src={data.image}
                        className=" animate-wiggle rounded-lg object-cover w-40 h-28 select-none "
                        // style={{ userDrag: "none" }}
                      />
                    </div>
                  );
                }

                return (
                  <div className="undraggable rounded-lg object-cover w-40 h-28 border-dashed border border-white/10 flex justify-center items-center text-3xl text-white/20">
                    <Typography>{index + 1}</Typography>
                  </div>
                );
              })}
            </ReactSortable>
            {/* </div> */}
          </div>

          <div className="text-center text-white/50 px-8 my-8">
            <Button onClick={handleDeleteBucket} className="w-full" variant="destructive">
              Delete Bucket
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
          <video
            autoPlay
            controls={false}
            ref={videoRef}
            src={data.videos[currentVideo]?.videoUrl}
            onEnded={handleNextVideo}
            className="w-full h-full object-center rounded-none z-10"
          />

          <div className="transition cursor-pointer absolute top-2 right-4 p-1 rounded-md bg-slate-300/20 backdrop-blur-sm border-white border hover:bg-slate-300/50">
            <Icon onClick={toggleFullscreen} className="text-3xl text-white" icon="iconamoon:screen-full-duotone" />
          </div>
        </div>
      </div>
      <div className="text-white flex flex-row h-48 px-8 my-6">
        <div className="flex basis-2/12 flex-col items-center gap-2 justify-center">
          <img src={user.picture.md} className="rounded-full object-cover w-20" />
          <Typography variant="small">215k</Typography>
          <Button variant="secondary">Anchor</Button>
        </div>

        <div className="flex basis-10/12 flex-col w-full gap-8 pl-4 pb-4">
          <div className="flex flex-row justify-between items-center">
            <div>
              <Typography variant="large">{user.name}</Typography>
              <Typography variant="small">{user.role}</Typography>
            </div>
            <div>
              <Button onClick={() => setEditMode(true)} variant="secondary">
                Edit Bucket
              </Button>
            </div>
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
          {data.videos.map(({ image }, index) => (
            <div key={image}>
              <img src={image} className="rounded-lg object-cover w-40 h-28" />
            </div>
          ))}
        </div>
      </div>
    </PageModal>
  );
};
