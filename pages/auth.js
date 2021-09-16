import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { supabase } from "../helpers/supabase-clientside";

export default function Auth() {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event !== "SIGNED_IN") {
          return;
        }

        const response = await fetch("/api/login", {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          }),
          credentials: "same-origin",
        });

        if (response.ok) {
          if (router?.query?.redirectTo) {
            router.push(router?.query?.redirectTo);
            return;
          }

          router.push("/getting-started");
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, [router]);

  return (
    <main>
      <Head>
        <title>Ko-fi Custom Alerts - Logging in...</title>
      </Head>

      <h1>Ko-fi Custom Alerts</h1>

      <p>Logging in...</p>
    </main>
  );
}
