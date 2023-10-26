import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAuthentication } from "@/hooks/useAuthentication";

// Components
import { SideBar } from "@/components/SideBar";
import { NavBar } from "@/components/NavBar";

// ChadUI
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/chadcn/Tabs";

// Screens
import { Buckets } from "./buckets";
import { Typography } from "@/chadcn/Typography";
import { Button } from "@/chadcn/Button";
import { useCollection } from "@/hooks/useCollection";

const Example1 = () => {
  return <div className="bg-red-500 w-full h-screen">example</div>;
};

const Example2 = () => {
  return <div className="bg-blue-500">example</div>;
};

export const Profile = () => {
  // Hooks
  const { user: currentUser } = useAuthentication();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { getBy } = useCollection("users", true);

  const [profileUsername, setProfileUsername] = React.useState("");
  const [profile, setProfile] = React.useState({});

  React.useEffect(() => {
    const username = pathname.slice(1).split("/")[0].toLowerCase();

    if (username !== profileUsername) {
      setProfileUsername(username);
      getBy("where", "username", "==", username).then(setProfile);
    }
  }, [pathname]);

  React.useEffect(() => {
    console.log(profile);
  }, [profile]);

  return (
    <div className="container">
      {/* Overlay */}
      <NavBar />

      <SideBar />

      <div>
        {/* Header */}
        <div className="flex flex-col items-center">
          <img src={profile?.photoURL} className="rounded-full object-cover aspect-square w-48" />
          <Typography variant="h2">{profile?.name}</Typography>
          <Typography variant="blockquote">
            “If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.”
          </Typography>
        </div>

        <div className="flex my-20 gap-4 justify-center">
          <Button variant="ghost" onClick={() => navigate("audio")}>
            <Typography variant="large">Audio</Typography>
          </Button>
          <Button variant="ghost" onClick={() => navigate("buckets")}>
            <Typography variant="large">Buckets</Typography>
          </Button>
          <Button variant="ghost" onClick={() => navigate("experience")}>
            <Typography variant="large">Experience</Typography>
          </Button>
          <Button variant="ghost" onClick={() => navigate("recommends")}>
            <Typography variant="large">Recommends</Typography>
          </Button>
          <Button variant="ghost" onClick={() => navigate("quests")}>
            <Typography variant="large">Quests</Typography>
          </Button>
          <Button variant="ghost" onClick={() => navigate("website")}>
            <Typography variant="large">Website</Typography>
          </Button>
        </div>
      </div>

      {/* Screens */}

      <Routes>
        {/* Fallback */}
        <Route path="/" element={<Buckets />} />

        {/* Subscreens */}
        <Route path="/buckets" element={<Buckets />} />
        <Route path="/experience" element={<Example2 />} />
      </Routes>
    </div>
  );
};
