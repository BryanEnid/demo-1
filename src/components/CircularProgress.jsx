import React from "react";

export const CircularProgress = ({ value }) => {
  return (
    <div className="relative w-32 h-32">
      <div
        className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-transparent transform rotate-90"
        style={{ transform: `rotate(${(value / 100) * 360}deg)` }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white font-bold text-lg">{value}%</div>
    </div>
  );
};
