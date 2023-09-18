import React from "react";
import { Box, Grid } from "@mui/material/";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Landpage = () => {
  const navigate = useNavigate(); // Get the navigate function

  // Define the routes you want to navigate to
  const formRoute = "/form"; // Replace with your actual form route
  const cameraRoute = "/camera"; // Replace with your actual camera route
  const pushNotificationRoute = "/push-notification"; // Replace with your actual push notification route
  const paymentSystemRoute = "/pay"; // Replace with your actual payment system route

  return (
    <Box sx={{ flex: 1 }}>
      <Grid
        container
        spacing={8}
        sx={{
          flexGrow: 1,
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Grid item>
          <center>DEMOs</center>
        </Grid>

        <Grid item>
          <center>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(formRoute)} // Navigate to the form route
            >
              Form (FOCUS / MODALS)
            </Button>
          </center>
        </Grid>

        <Grid item>
          <center>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(cameraRoute)} // Navigate to the camera route
            >
              Camera
            </Button>
          </center>
        </Grid>

        <Grid item>
          <center>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(pushNotificationRoute)} // Navigate to the push notification route
            >
              Push notification
            </Button>
          </center>
        </Grid>

        <Grid item>
          <center>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(paymentSystemRoute)} // Navigate to the payment system route
            >
              Payment system (Stripe)
            </Button>
          </center>
        </Grid>

        <Grid item>
          <center>Note: Also, this screen is a demo for routing</center>
        </Grid>
      </Grid>
    </Box>
  );
};
