import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { signIn } from "../helpers/supabase-clientside";

import logger from "../helpers/logger";
import Button from "../components/Button/Button";

export default function Login() {
  const router = useRouter();
  const [queryString, setQueryString] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (router?.asPath) {
      const newQueryString = router.asPath.replace(
        router.pathname,
        ""
      );
      setQueryString(newQueryString);
    }
  }, [router]);

  const handleTwitchLoginClick = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    const { error } = await signIn(
      {
        provider: "twitch",
      },
      {
        redirectTo: router.query.redirectTo || null,
      }
    );

    if (error) {
      logger.error({ error });
    }
  };

  return (
    <main>
      <Head>
        <title>Ko-fi XYZ - Login/Signup</title>
      </Head>

      <h1>
        <Image src="/ko-fi-logo.png" alt="" width="30" height="30" />{" "}
        Ko-fi XYZ
      </h1>

      <h2>Login/Signup</h2>

      <Button
        onClick={handleTwitchLoginClick}
        disabled={isLoading}
        isTwitch
      >
        Continue with Twitch
      </Button>

      <p>Or</p>

      <Link href={`/login-email${queryString}`} passHref>
        <Button isSecondary disabled={isLoading}>
          Continue with Email
        </Button>
      </Link>
    </main>
  );
}
