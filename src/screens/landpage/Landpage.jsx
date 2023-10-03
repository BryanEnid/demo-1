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
    <div style={{ flex: 1 }}>
      <center>
        <button
          variant="outlined"
          size="large"
          onClick={() => navigate(cameraRoute)} // Navigate to the camera route
        >
          Camera
        </button>
      </center>
    </div>
  );
};
