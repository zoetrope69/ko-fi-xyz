import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import { signIn } from "../helpers/supabase-clientside";

import logger from "../helpers/logger";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleTwitchLoginClick = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    const { error } = await signIn({
      provider: "twitch",
    });

    if (error) {
      logger.error({ error });
    }
  };

  return (
    <main>
      <Head>
        <title>Ko-fi Custom Alerts - Login/Signup</title>
      </Head>

      <h1>Ko-fi Custom Alerts</h1>

      <h2>Login/Signup</h2>

      <button
        className="Button Button--Twitch"
        onClick={handleTwitchLoginClick}
        disabled={isLoading}
      >
        Login/signup with Twitch
      </button>

      <p>Or</p>

      <Link href="/login-email" passHref>
        <div
          className={`Button Button--secondary ${
            isLoading ? "Button--disabled" : ""
          }`}
        >
          Login/signup with Email
        </div>
      </Link>
    </main>
  );
}
