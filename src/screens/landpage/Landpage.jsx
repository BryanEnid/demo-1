import { Button } from "@/chadcn/Button";
import { useAuthentication } from "@/hooks/useAuthentication";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Landpage = () => {
  const navigate = useNavigate(); // Get the navigate function
  const { user, signInWithGoogle, signOutUser } = useAuthentication();

  React.useEffect(() => {
    console.log(user);
  }, [user]);

  const handleSignIn = () => {};

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="flex flex-col gap-2 ">
        <Button
          onClick={() => navigate("/profile")} // Navigate to the camera route
        >
          GO TO PROFILE – DEMO
        </Button>

        <div className="h-60" />

        <Button
          variant="outline"
          onClick={signInWithGoogle} // Navigate to the camera route
        >
          Authenticate with google
        </Button>

        <Button
          variant="outline"
          onClick={signOutUser} // Navigate to the camera route
        >
          Sign out
        </Button>
      </div>
      <div className="w-[90vw] overflow-y-auto bg-slate-400 mt-4 p-4 rounded-lg">
        <pre>{user ? JSON.stringify(user, null, 2) : "no user"}</pre>
      </div>
    </div>
  );
};
