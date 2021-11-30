import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useUser } from "../components/UserProvider/UserProvider.js";
import { supabase, signOut } from "../helpers/supabase-clientside.js";
import logger from "../helpers/logger.js";

export default function Logout() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  async function logout() {
    const { error } = await signOut();

    if (error) {
      return logger.error(error);
    }

    return;
  }

  useEffect(() => {
    let authListener;

    if (!isLoading) {
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = supabase.auth.onAuthStateChange((event) => {
        if (event !== "SIGNED_OUT") {
          return;
        }

        router.push("/login");
      });
      authListener = data;

      logout();
    }

    return () => {
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, [router, isLoading, user]);

  return (
    <main>
      <Head>
        <title>Ko-fi XYZ - Logging out...</title>
      </Head>

      <h1>
        <Image src="/ko-fi-logo.png" alt="" width="30" height="30" />{" "}
        Ko-fi XYZ
      </h1>

      <p>Logging out...</p>
    </main>
  );
}
