import React from "react";
import { Button } from "@/chadcn/Button";
import { Icon } from "@iconify/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/chadcn/Card";
import { Typography } from "@/chadcn/Typography";

export const MediaSelector = ({ onChange }) => {
  const handleFileSelect = () => {
    onChange("file", {});
  };

  const handleDroppedfile = () => {
    onChange("file", {});
  };

  return (
    <div className="flex flex-row gap-4 ">
      <Card
        onClick={() => onChange("live")}
        className="flex w-80 h-80 justify-center items-center hover:bg-amber-100/70 bg-amber-200/40 transition-all cursor-pointer"
      >
        <CardContent>
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="bg-white/40 rounded-full p-4">
              <Icon
                icon="fluent:live-24-regular"
                className="text-slate-800 text-7xl"
              />
            </div>

            <div>
              <Typography variant="large">Go live</Typography>
              <Typography variant="small">
                Supports VR and 360 videos
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex w-80 h-80 border-dashed justify-center items-center bg-slate-100/80 shadow-none">
        <CardContent>
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="bg-slate-300/20 rounded-full p-4">
              <Icon
                icon="line-md:upload-loop"
                className="text-slate-800 text-5xl"
              />
            </div>

            <Typography variant="small">
              Drag and drop video files to upload
            </Typography>

            <Button variant="outline">Select files</Button>
          </div>
        </CardContent>
      </Card>

      <Card
        onClick={() => onChange("record")}
        className="flex w-80 h-80 justify-center items-center hover:bg-sky-100/70 bg-sky-200/40 transition-all cursor-pointer"
      >
        <CardContent>
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="bg-white/40  rounded-full p-4">
              <Icon icon="bx:devices" className="text-slate-800 text-7xl" />
            </div>

            <div>
              <Typography variant="large">Record</Typography>

              <Typography variant="small">
                Peripherals or Screen record
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
