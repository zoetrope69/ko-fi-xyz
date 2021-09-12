import Head from "next/head";
import { useState } from "react";

import { signIn } from "../helpers/supabase-clientside";

import logger from "../helpers/logger";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasEmailBeenSent, setHasEmailBeenSent] = useState(false);

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
