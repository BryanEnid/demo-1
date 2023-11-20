import { Button } from "@/chadcn/Button";
import { Input } from "@/chadcn/Input";
import { useAuthenticationProviders } from "@/hooks/useAuthenticationProviders";
import { useCollection } from "@/hooks/useCollection";
import React, { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import _ from "lodash";
import { Icon } from "@iconify/react";
import { Typography } from "@/chadcn/Typography";
import { useUser } from "@/hooks/useUser";
import { Separator } from "@/chadcn/Separator";
import { ObserveIcon } from "@/components/ObserveIcon";
import { getAuth } from "firebase/auth";
import { useAuth } from "@/providers/Authentication";
import { Spinner } from "@/components/Spinner";

export const SignIn = () => {
  // Hooks
  const navigate = useNavigate(); // Get the navigate function
  // const { user, signInWithGoogle, signOutUser, createUser } = useAuthenticationProviders();
  const { user, login, isLoading } = useAuth();

  const { checkAvailableUsername } = useCollection("users");

  // State
  const [username, setUsername] = React.useState("");
  const [isUsernameAvailable, setUsernameAvailable] = React.useState(null);
  const [isChecking, setChecking] = React.useState(false);

  // Refs
  const debounceRef = React.useRef(null);

  const handleSignIn = (type) => {
    // TODO: firebase functions or lambda functions when using aws to create a documents for the user
    login();
  };

  const handleUsernameChange = ({ target }) => {
    setChecking(true);
    debounceRef.current?.cancel();

    // Declare
    const newUsername = target.value;
    const handleDebounce = () => {
      checkAvailableUsername(newUsername).then((value) => {
        setUsernameAvailable(value);
        setChecking(false);
      });
    };

    // Set input
    setUsername(newUsername);

    // start debouncing
    const debounceInstance = _.debounce(handleDebounce, 500);
    debounceRef.current = debounceInstance;
    debounceInstance();
  };

  if (isLoading) return <></>;
  if (user) return <Navigate to="/profile" />;

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="grid grid-cols-2 w-full h-full ">
        {/* <!-- Left Section --> */}
        <div className="flex flex-col gap-8 h-full bg-blue-600 px-20 py-10 text-white">
          <div className="basis-1/3 text-4xl font-bold mb-4">Observe</div>

          <div className="flex basis-2/3 flex-col gap-6">
            <div className="mt-10 text-5xl  font-medium">Explore the Sea of Jobs</div>
            <div className="mt-4 text-2xl ">
              We curate career learning experiences for <br />
              curious minds like yours
            </div>

            <div className="mt-8">
              <Button
                className="text-2xl p-8 px-12 font-medium text-blue-600 bg-white"
                variant="outline"
                // onClick={user ? signOutUser : signInWithGoogle} // Toggle between sign-in and sign-out
              >
                <Typography variant="large">Access in Guest Mode</Typography>
              </Button>
            </div>
          </div>

          <div>
            <Typography variant="small">AI / VR enabled for career immersion purposes.</Typography>
          </div>
        </div>

        {/* <!-- Right Section --> */}
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="flex flex-col justify-center items-center gap-8 w-[400px]">
            <div className="flex flex-col gap-8 justify-center items-center mb-10">
              <div>
                <ObserveIcon rounded size={70} />
              </div>

              <Typography variant="h2">Welcome to Observe</Typography>
            </div>

            <Button
              className="text-md w-full font-medium text-white bg-blue-600 rounded-full"
              variant="outline"
              onClick={handleSignIn}
              // onClick={user ? signOutUser : signInWithGoogle} // Toggle between sign-in and sign-out
            >
              <Typography variant="large">Sign up</Typography>
            </Button>

            <div className="flex flex-row justify-center items-center w-[150px]">
              <Separator />
              <span className="mx-4">or</span>
              <Separator />
            </div>

            <Button className="w-full font-medium text-blue-600 rounded-full" variant="outline" onClick={handleSignIn}>
              <Typography variant="large">Login</Typography>
            </Button>

            <div className="text-sm items-center text-center text-blue-600">
              <a href="google.com">Terms of Use | Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="flex flex-col gap-2 ">
        <Button
          onClick={() => navigate(`/${user.username}`)} // Navigate to the camera route
          disabled={!user}
        >
          GO TO PROFILE – DEMO
        </Button>

        <div className="h-60" />

        {/* {!user && (
          <div className=" flex flex-col gap-2 mt-6 rounded-sm bg-slate-300 p-4">
            <div>What's the username you want ot use?</div>

            <Input onChange={handleUsernameChange} type="text" id="myInput" data-lpignore="true" className="bg-white" />
            {isChecking && (
              <div className="flex flex-row justify-center items-center gap-2 text-primary">
                <Icon className="" icon="eos-icons:loading" />
                <Typography variant="small">Checking username on server</Typography>
              </div>
            )}

            {isUsernameAvailable === false && username.length > 3 && !isChecking && (
              <div className="flex flex-row justify-center items-center gap-2 text-primary">
                <Typography variant="small">User already exists</Typography>
              </div>
            )}

            {isUsernameAvailable && !isChecking && (
              <div className="flex flex-row justify-center items-center gap-2 text-green-600">
                <Icon className="" icon="gg:check-o" />
                <Typography variant="small">Valid user</Typography>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => handleSignIn("SignIn")} // Navigate to the camera route
              disabled={!(username.length > 3 && isUsernameAvailable && !isChecking)}
            >
              Google – Sign In
            </Button>
          </div>
        )} */}

        <div className="flex flex-col gap-1">
          {!user && (
            <div className="flex flex-col gap-2 rounded-sm text-center ">
              {/* or */}
              <Button
                onClick={() => handleSignIn("LogIn")} // Navigate to the camera route
                className="px-20"
              >
                Log In – Google
              </Button>
            </div>
          )}
          {!user && (
            <div className="flex flex-col gap-2 rounded-sm text-center">
              {/* or */}
              <Button
                variant="link"
                className="text-primary"
                onClick={() => handleSignIn("SignIn")} // Navigate to the camera route
              >
                or Sign In – Google
              </Button>
            </div>
          )}
        </div>

        {user && (
          <Button
            variant="outline"
            className="text-primary"
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
