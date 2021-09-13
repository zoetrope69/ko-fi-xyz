import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { supabase, signOut } from "../helpers/supabase-clientside";
import logger from "../helpers/logger";
import useGetSession from "../hooks/useGetSession";

export default function Logout() {
  const router = useRouter();
  const { session, isGettingSession } = useGetSession();

  async function logout() {
    const { error } = await signOut();

    if (error) {
      return logger.error(error);
    }

    return;
  }

  useEffect(() => {
    let authListener;

    if (!isGettingSession) {
      if (!session) {
        router.push("/login");
        return;
      }

      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event !== "SIGNED_OUT") {
            return;
          }

          await fetch("/api/auth", {
            method: "POST",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            }),
            credentials: "same-origin",
            body: JSON.stringify({ event, session }),
          });

          router.push("/login");
        }
      );
      authListener = data;

      logout();
    }

    return () => {
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, [router, isGettingSession, session]);

  return (
    <main>
      <Head>
        <title>Ko-fi Custom Alerts - Logging out...</title>
      </Head>

      <h1>Ko-fi Custom Alerts</h1>

      <p>Logging out...</p>
    </main>
  );
}
