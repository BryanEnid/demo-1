import { Button } from "@/chadcn/Button";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Landpage = () => {
  const navigate = useNavigate(); // Get the navigate function

  // Define the routes you want to navigate to
  const formRoute = "/form"; // Replace with your actual form route
  const cameraRoute = "/camera"; // Replace with your actual camera route
  const pushNotificationRoute = "/push-notification"; // Replace with your actual push notification route
  const paymentSystemRoute = "/pay"; // Replace with your actual payment system route

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col gap-2 ">
        <Button
          onClick={() => navigate("/profile")} // Navigate to the camera route
        >
          GO TO PROFILE – DEMO
        </Button>
      </div>
    </div>
  );
};
