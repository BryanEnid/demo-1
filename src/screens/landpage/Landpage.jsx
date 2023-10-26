import { Button } from "@/chadcn/Button";
import { Input } from "@/chadcn/Input";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useCollection } from "@/hooks/useCollection";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Landpage = () => {
  const navigate = useNavigate(); // Get the navigate function
  const { user, signInWithGoogle, signOutUser, createUser } = useAuthentication();
  const [username, setUsername] = React.useState("");

  const handleSignIn = () => {
    signInWithGoogle().then((user) => {
      const data = {
        username: username.toLowerCase(),
        photoURL: user.photoURL,
        name: user.displayName,
        email: user.email,
        providerData: user.providerData,
        reloadUserInfo: user.reloadUserInfo,
        uid: user.uid,
      };
      createUser(data, user.uid);
    });
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="flex flex-col gap-2 ">
        <Button
          onClick={() => navigate("/profile")} // Navigate to the camera route
        >
          GO TO PROFILE – DEMO
        </Button>

        <div className="h-60" />

        {!user && (
          <div className="flex flex-col gap-2 mt-6 rounded-sm bg-slate-300 p-4">
            <div>What's the username you want ot use?</div>
            <Input className="bg-white" onChange={({ target }) => setUsername(target.value)} type="username" placeholder="Create your username" />
            <Button
              variant="outline"
              onClick={handleSignIn} // Navigate to the camera route
              disabled={!(username.length > 3)}
            >
              Authenticate with google
            </Button>
          </div>
        )}

        {user && (
          <Button
            variant="outline"
            onClick={signOutUser} // Navigate to the camera route
          >
            Sign out
          </Button>
        )}
      </div>
      <div className="w-[90vw] overflow-y-auto bg-slate-400 mt-4 p-4 rounded-lg">
        <pre>{user ? JSON.stringify(user, null, 2) : "no user"}</pre>
      </div>
    </div>
  );
};
