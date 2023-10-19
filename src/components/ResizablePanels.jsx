import React from "react";
import {
  Panel as Box,
  PanelGroup as Group,
  PanelResizeHandle,
} from "react-resizable-panels";
import styles from "./ResizablePanels.module.css";
import { Icon } from "@iconify/react";

export const ResizeHandle = ({ className = "", id, direction }, ...rest) => {
  // .Icon {
  //   width: 1em;
  //   height: 1em;
  //   position: absolute;
  //   left: calc(50% - 0.5rem);
  //   top: calc(50% - 0.5rem);
  // }

  return (
    <PanelResizeHandle
      className={[styles.ResizeHandleOuter, className].join(" ")}
      id={id}
    >
      <div className="flex justify-center items-center h-full backdrop-blur-lg backdrop-brightness-50 text-white p-1">
        <Icon
          icon={
            direction != "horizontal"
              ? "uil:arrows-resize"
              : "uil:arrows-resize-v"
          }
        />
      </div>
    </PanelResizeHandle>
  );
};

export const PanelGroup = ({ children, ...props }) => (
  <Group {...props}>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { deirection: props.direction })
    )}
  </Group>
);

export const Panel = ({ children, ...props }) => (
  <Box className={styles.Panel} {...props}>
    {children}
  </Box>
);
