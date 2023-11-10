import React from "react";
import { Typography } from "@/chadcn/Typography";
import { PreviewBucket } from "@/components/PreviewBucket";

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
          <video autoPlay muted loop src={preview} className=" object-cover aspect-square shadow drop-shadow-xl p-1 bg-white rounded-full" />
        </button>

        <Typography>{name}</Typography>
      </div>

      {!onClick && <PreviewBucket show={open} onClose={handleExit} data={data} documentId={documentId} />}
    </>
  );
};
