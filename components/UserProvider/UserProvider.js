import React, {
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import useSWR from "swr";

import { supabase } from "../../helpers/supabase-clientside.js";

import { fetcher } from "../../hooks/useAPI.js";
import logger from "../../helpers/logger.js";

export const UserContext = createContext({
  user: null,
  session: null,
  error: null,
  isLoading: null,
});

async function updateServersideAuth({ event, session }) {
  return fetch("/api/auth", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    }),
    credentials: "same-origin",
    body: JSON.stringify({ event, session }),
  });
}

export const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const { data: userData, error } = useSWR(
    session?.access_token
      ? ["/api/user", session?.access_token]
      : null,
    fetcher
  );
  const isLoading = typeof user === "undefined" && !error && session;

  useEffect(() => {
    if (error) {
      setUser(null);
    } else {
      setUser(userData);
    }
  }, [userData, error]);

  useEffect(() => {
    const initialSession = supabase.auth.session();
    setSession(initialSession);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        logger.log(`Supabase auth event: ${event}`);

        await updateServersideAuth({ event, session: newSession });
        setSession(newSession);
      }
    );

    const localStorageChangeHandler = async (event) => {
      if (event?.key !== "supabase.auth.token") {
        return;
      }

      try {
        const newSession = JSON.parse(event.newValue);

        setSession(newSession?.currentSession);

        if (!newSession?.currentSession) {
          await updateServersideAuth({
            event: "SIGNED_OUT",
            session: newSession?.currentSession,
          });
        }
      } catch (e) {
        logger.error("Couldnt get auth from localstorage");
      }
    };

    window.addEventListener("storage", localStorageChangeHandler);

    return () => {
      window.removeEventListener(
        "storage",
        localStorageChangeHandler
      );

      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  const value = {
    session,
    user,
    error,
    isLoading,
  };
  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider.`);
  }
  return context;
};
