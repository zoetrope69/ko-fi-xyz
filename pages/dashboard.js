import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import Button from "../components/Button/Button";
import Navigation from "../components/Navigation/Navigation";
import AlertsList from "../components/AlertsList/AlertsList";

import { supabase } from "../helpers/supabase-clientside";
import useAPI from "../hooks/useAPI";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isPoppedOut, setIsPoppedOut] = useState(false);
  const { query } = useRouter();
  const { data: user, isLoading } = useAPI("/api/user");

  useEffect(() => {
    if (query?.popOut) {
      setIsPoppedOut(true);
      document.body.classList.add("darkMode");
    } else {
      document.body.classList.remove("darkMode");
    }
  }, [query]);

  if (isPoppedOut) {
    return (
      <>
        <Head>
          <title>Ko-fi Custom Alerts - Dashboard (Popped Out)</title>
        </Head>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ width: "100%", height: "100%" }}>
            <AlertsList overlayId={user?.overlay_id} isPoppedOut />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="wrapper">
      <Head>
        <title>Ko-fi Custom Alerts - Dashboard</title>
      </Head>

      <Navigation user={user} isLoading={isLoading} />

      <main>
        <h2>Dashboard</h2>

        <Link href="/dashboard?popOut=true" passHref>
          <Button isSmall isSecondary>
            Popout for OBS
          </Button>
        </Link>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <AlertsList overlayId={user?.overlay_id} />
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { user: authorisedUser } =
    await supabase.auth.api.getUserByCookie(req);

  if (!authorisedUser) {
    // If no user, redirect to index.
    return {
      props: {},
      redirect: {
        destination: `/login?redirectTo=${encodeURIComponent(
          req.url
        )}`,
        permanent: false,
      },
    };
  }

  // If there is a user, return it.
  return { props: { authorisedUser } };
}
