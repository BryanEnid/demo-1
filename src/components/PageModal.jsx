import React from "react";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export const PageModal = ({ children, show, onClose }) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={(...props) => {
          onClose(...props);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-blue-900/90 brightness-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen">
          <div
            className="flex min-h-full items-end justify-center text-center sm:items-center"
            brightness-50brightness-50
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={
                  "drop-shadow-[0_05px_10px_rgba(255,255,255,200)] overflow-hidden border-2 backdrop-blur-xl backdrop-brightness-50 border-white relative transform rounded-lg text-left transition-all max-w-3xl"
                }
              >
                <div
                  style={{
                    background: "#00173A",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="sm:flex sm:items-start ">
                    <div
                      className="text-center sm:text-left "
                      style={{ width: "768px" }}
                    >
                      {children}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
