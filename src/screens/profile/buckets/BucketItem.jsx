import React from "react";
import { Typography } from "@/chadcn/Typography";
import { PreviewBucket } from "@/components/PreviewBucket";
import { Icon } from "@iconify/react";

export const BucketItem = ({ name, preview, data, documentId, onClick }) => {
  // State
  const [open, setOpen] = React.useState(false);

  const handleExit = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <button onClick={onClick ? () => onClick(data) : () => setOpen(true)} className="w-[200px]">
          <div className="object-cover aspect-square shadow drop-shadow-xl p-1 bg-white rounded-full">
            {preview && (
              <video
                type="video/mp4"
                autoPlay
                muted
                loop
                src={preview}
                // crossOrigin="use-credentials"
                className="object-cover aspect-square rounded-full"
              />
            )}

            {!preview && (
              <div className="flex h-full w-full justify-center items-center text-gray-300">
                <Icon fontSize="130" icon="solar:gallery-circle-broken" />
              </div>
            )}
          </div>
        </button>

        <Typography>{name}</Typography>
      </div>

      {!onClick && <PreviewBucket show={open} onClose={handleExit} data={data} documentId={documentId} />}
    </>
  );
};
