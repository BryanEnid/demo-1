import React from "react";
import { useLocation } from "react-router-dom";
import { useCollection } from "@/hooks/useCollection";

export const useProfile = () => {
  // Hooks
  const { pathname } = useLocation();
  const { getBy } = useCollection("users", true);

  // State
  const [isLoading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState({});

  // Get username form URL
  React.useEffect(() => {
    // TODO: User TANSTACK QUERY
    // TODO: Get UID as well

    // URL
    const username = pathname.slice(1).split("/")[0];

    // Set data
    getBy("where", "username", "==", username)
      .then((data) => setProfile(data[0]))
      .finally(() => setLoading(false));
  }, []);

  return { profile, isLoading };
};
