import { Button } from "@/chadcn/Button";
import { Typography } from "@/chadcn/Typography";
import { PageModal } from "@/components/PageModal";
import { PreviewBucket } from "@/components/PreviewBucket";
import { useUserData } from "@/hooks/useUserData";
import { Icon } from "@iconify/react";
import React from "react";

export const BucketItem = ({ name, preview, data }) => {
  const { user } = useUserData();
  const [open, setOpen] = React.useState(false);

  const handleExit = () => {
    setOpen(false);
  };

  if (!user) return <></>;

  return (
    <>
      <div className="flex flex-col items-center">
        <button onClick={() => setOpen(true)} className="">
          <video
            autoPlay
            muted
            loop
            src={preview}
            className=" object-cover aspect-square shadow drop-shadow-xl p-1 bg-white rounded-full"
          />
        </button>

        <Typography>{name}</Typography>
      </div>

      <PreviewBucket show={open} onClose={handleExit} data={data} />
    </>
  );
};
