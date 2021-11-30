import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { supabase } from "../helpers/supabase-clientside.js";

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
        <title>Ko-fi XYZ - Logging in...</title>
      </Head>

      <h1>
        <Image src="/ko-fi-logo.png" alt="" width="30" height="30" />{" "}
        Ko-fi XYZ
      </h1>
      <p>Logging in...</p>
    </main>
  );
}
