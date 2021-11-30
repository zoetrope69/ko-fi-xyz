import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import Button from "../components/Button/Button.js";
import { redirectToDashboardPageIfLoggedIn } from "../helpers/redirect-auth-pages.js";
import { signIn } from "../helpers/supabase-clientside.js";
import logger from "../helpers/logger.js";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasEmailBeenSent, setHasEmailBeenSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    const { elements } = event.target;

    const { error } = await signIn(
      {
        email: elements.email.value,
      },
      {
        redirectTo: router.query.redirectTo || null,
      }
    );

    if (error) {
      logger.error({ error });
    } else {
      setHasEmailBeenSent(true);
    }
  };

  return (
    <main>
      <Head>
        <title>Ko-fi XYZ - Continue with Email</title>
      </Head>

      <h1>
        <Image src="/ko-fi-logo.png" alt="" width="30" height="30" />{" "}
        Ko-fi XYZ
      </h1>

      <h2>Continue with Email</h2>

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
          <Button disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      )}
    </main>
  );
}

export async function getServerSideProps({ req }) {
  return redirectToDashboardPageIfLoggedIn(req);
}
