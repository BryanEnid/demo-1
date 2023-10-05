import React from "react";
import { Icon } from "@iconify/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
} from "@/chadcn/DropDown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/chadcn/Tooltip";
import { useOrientation } from "@/hooks/useOrientation";

export const DebugOverlay = ({ data = [] }) => {
  const { isPortrait } = useOrientation();
  const context = React.useRef(new Map());

  React.useEffect(() => {
    console.log("portrait:", isPortrait);
  }, [isPortrait]);

  if (!data.length) return <></>;

  return (
    <TooltipProvider>
      <DropdownMenu>
        <div
          className={
            "flex absolute w-full bg-transparent bottom-20 " +
            (isPortrait ? "justify-center " : "justify-end right-5")
          }
        >
          <div
            className={
              "flex rounded-full z-10 gap-6 backdrop-blur-md bg-gray-800/5 text-white border border-gray-300/20 " +
              (isPortrait
                ? "px-6 pt-1 justify-center items-center"
                : "flex-col-reverse px-2 py-3 items-center left-0")
            }
          >
            {data.map((item, index) => {
              const [iconIndex, setIcon] = React.useState(0);
              const [title, setTitle] = React.useState(item.title);
              const [selected, setSelected] = React.useState();

              React.useEffect(() => {
                context.current.set(index, { ...item, setIcon, setTitle });
              }, []);

              React.useEffect(() => {
                setSelected(item?.selected);
              }, [item.selected]);

              const handleOnClick = (item, value) => {
                item.action({
                  this: item,
                  siblings: context.current,
                  selected: value,
                  iconIndex,
                  setIcon,
                  title,
                  setTitle,
                });
              };

              const Component = () => (
                <Icon
                  icon={item.icon?.[iconIndex] ?? "ci:circle-help"}
                  fontSize={40}
                  onClick={() => handleOnClick(item)}
                  className={`transition ease-in-out hover:text-primary ${item?.className?.[iconIndex]}`}
                />
              );

              return (
                <div key={item.title}>
                  <div className="transition hover:scale-125">
                    <Tooltip>
                      {item?.type === "dropdown" ? (
                        // ! <button> cannot appear as a descendant of <button>
                        <TooltipTrigger>
                          <DropdownMenuTrigger>
                            <Component />
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                      ) : (
                        <TooltipTrigger>
                          <Component />
                        </TooltipTrigger>
                      )}

                      <TooltipContent>
                        <p>{title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {!!item?.options?.length && (
                    <DropdownMenuContent>
                      <DropdownMenuLabel>{title}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={selected}
                        onValueChange={(value) => {
                          setSelected(value);
                          handleOnClick(item, value);
                        }}
                      >
                        {item?.options?.map((option) => (
                          // TODO: MAke menu item work as well
                          // <DropdownMenuItem
                          //   key={option.label}
                          //   onClick={() => handleOnClick(item, option)}
                          // >
                          //   {option.label}
                          // </DropdownMenuItem>
                          <DropdownMenuRadioItem
                            key={option.label}
                            value={option.value}
                          >
                            {option.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DropdownMenu>
    </TooltipProvider>
  );
};
