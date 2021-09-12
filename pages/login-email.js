import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { signIn, supabase } from "../helpers/supabase-clientside";

import logger from "../helpers/logger";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasEmailBeenSent, setHasEmailBeenSent] = useState(false);

  useEffect(() => {
    setIsLoading(false);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event !== "SIGNED_IN") {
          return;
        }

        setIsLoading(true);

        const response = await fetch("/api/login", {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        });

        if (response.ok) {
          router.push("/dashboard");
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    const { elements } = event.target;

    const { error } = await signIn({
      email: elements.email.value,
    });

    if (error) {
      logger.error({ error });
    } else {
      setHasEmailBeenSent(true);
    }
  };

  return (
    <main>
      <Head>
        <title>Ko-fi Custom Alerts - Login/Signup with Email</title>
      </Head>

      <h1>Ko-fi Custom Alerts</h1>

      <h2>Login/Signup with Email</h2>

      {hasEmailBeenSent ? (
        <p>Check your email!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            disabled={isLoading}
          />
          <button className="Button" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </main>
  );
}
