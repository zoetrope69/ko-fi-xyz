import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import Button from "../components/Button/Button";
import Navigation from "../components/Navigation/Navigation";
import AlertsList from "../components/AlertsList/AlertsList";

import { useUser } from "../components/UserContext/UserContext";

import {
  getRedirectURL,
  redirectAuthedPages,
} from "../helpers/redirect-auth-pages";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [areTestAlertsHidden, setAreTestAlertsHidden] =
    useState(false);
  const [isPoppedOut, setIsPoppedOut] = useState(false);
  const { query } = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (query?.popOut) {
      setIsPoppedOut(true);
      document.body.classList.add("darkMode");
    } else {
      setIsPoppedOut(false);
      document.body.classList.remove("darkMode");
    }
  }, [query]);

  const handleHideTestAlertsClick = (event) => {
    event.preventDefault();

    setAreTestAlertsHidden((previous) => !previous);
  };

  if (isPoppedOut) {
    return (
      <>
        <Head>
          <title>Ko-fi Custom Alerts - Dashboard (Popped Out)</title>
        </Head>

        {isLoading && (
          <div style={{ padding: "1em" }}>
            <p>Loading...</p>
          </div>
        )}

        {!isLoading && !user && (
          <div style={{ padding: "1em" }}>
            <p>Logged out...</p>
            <Link href={getRedirectURL(router.asPath)} passHref>
              <Button>Log in</Button>
            </Link>
          </div>
        )}

        {!isLoading && user && (
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

        {isLoading ? (
          <div style={{ padding: "1em" }}>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <h2>Alerts</h2>

            <AlertsList
              overlayId={user?.overlay_id}
              areTestAlertsHidden={areTestAlertsHidden}
            />
          </>
        )}
      </main>
      <aside>
        <p>
          This is only a list of alerts while using the webhook
          integration.{" "}
          <Link href="https://ko-fi.com/manage/supportreceived">
            Go to Ko-fi to see everything.
          </Link>
        </p>

        <p>
          You can use the{" "}
          <Link href="/dashboard?popOut=true">
            &lsquo;popout &rsquo; version
          </Link>{" "}
          of this dashboard in OBS. Check out Andilippi &apos;s video
          on{" "}
          <Link href="https://www.youtube.com/watch?v=J4YJCXBshuw">
            how to add custom browser docks
          </Link>
          .
        </p>

        <Link href="/dashboard?popOut=true" passHref>
          <Button isSmall isSecondary>
            Popout for OBS
          </Button>
        </Link>

        <Button
          isSmall
          isSecondary
          style={{ marginLeft: "1em", marginBottom: "2em" }}
          onClick={handleHideTestAlertsClick}
        >
          {areTestAlertsHidden ? "Show" : "Hide"} test alerts
        </Button>
      </aside>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  return redirectAuthedPages(req);
}
