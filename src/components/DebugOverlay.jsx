import React from "react";
import { Icon } from "@iconify/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/chadcn/Tooltip";

export const DebugOverlay = ({ data = [] }) => {
  if (!data.length) return <></>;

  const handleOnCLick = (item) => {
    item;
  };

  return (
    <TooltipProvider>
      <div className="flex absolute bottom-0 w-full bg-transparent justify-center bottom-20">
        <div className="justify-center items-center flex rounded-full px-6 pt-1 z-10 gap-6 backdrop-blur-md bg-gray-800/5 text-white border border-gray-300/20">
          {data.map((item) => {
            const [iconIndex, setIcon] = React.useState(0);
            const [title, setTitle] = React.useState(item.title);

            const handleOnClick = (item) => {
              item.action({ og: item, iconIndex, setIcon, title, setTitle });
            };

            return (
              <div key={title} className="transition hover:scale-125">
                <Tooltip>
                  <TooltipTrigger>
                    <Icon
                      icon={
                        item.icon?.[iconIndex] ?? "grommet-icons:help-option"
                      }
                      fontSize={40}
                      onClick={() => handleOnClick(item)}
                      className={`transition ease-in-out hover:text-primary ${item?.className?.[iconIndex]}`}
                    />
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>{title}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};
