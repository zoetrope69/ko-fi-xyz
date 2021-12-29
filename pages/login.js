import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { redirectToDashboardPageIfLoggedIn } from "../helpers/redirect-auth-pages.js";
import { signIn } from "../helpers/supabase-clientside.js";

import logger from "../helpers/logger.js";
import Logo from "../components/Logo/Logo.js";
import Button from "../components/Button/Button.js";

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
        <Logo isSmall />
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

export async function getServerSideProps({ req }) {
  return redirectToDashboardPageIfLoggedIn(req);
}
