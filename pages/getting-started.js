import Link from "next/link";
import Head from "next/head";

import { useUser } from "../components/UserProvider";
import Button from "../components/Button/Button";
import Navigation from "../components/Navigation/Navigation";

import { redirectAuthedPages } from "../helpers/redirect-auth-pages";

const DEFAULT_DOMAIN = "https://ko-fi.xyz";

function getDomain() {
  if (!process.browser) {
    return DEFAULT_DOMAIN;
  }

  return window?.location?.origin || DEFAULT_DOMAIN;
}

export default function GettingStarted() {
  const domain = getDomain();
  const { user, isLoading } = useUser();

  if (!isLoading && !user?.id) {
    return (
      <div className="wrapper">
        <Head>
          <title>Ko-fi XYZ - Getting Started</title>
        </Head>

        <Navigation />

        <main>
          <h1>Ko-fi XYZ - Getting Started</h1>

          <p>Something went wrong. Try logging out...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Head>
        <title>Ko-fi XYZ - Getting Started</title>
      </Head>

      <Navigation />

      <main>
        <h2>Getting Started</h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {user && (
              <>
                <ol>
                  <li>
                    Go to the{" "}
                    <a
                      href="https://ko-fi.com/manage/webhooks"
                      target="_blank"
                      rel="noreferrer"
                    >
                      API/Webhooks page in your Ko-fi settings
                    </a>
                  </li>
                  <li>
                    Copy and paste in your webhook URL:
                    <code>
                      {domain}/api/webhook/{user.webhook_id}
                    </code>
                  </li>
                  <li>
                    Go to OBS. Create a new browser source with this
                    URL:
                    <code>
                      {domain}/overlay/{user.overlay_id}
                    </code>
                    Set the size to 1920x1080.
                  </li>
                  <li>
                    Go back to the{" "}
                    <a
                      href="https://ko-fi.com/manage/webhooks"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ko-fi API/Webhooks page
                    </a>{" "}
                    and press <q>Send Test</q>
                  </li>
                  <li>You should see an alert in OBS...</li>
                  <li>
                    Head over to the{" "}
                    <Link href="/settings">Settings</Link> and tweak
                    your alert
                  </li>
                </ol>
              </>
            )}
            {!user && (
              <Link href="/" passHref>
                <Button>Home</Button>
              </Link>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  return redirectAuthedPages(req);
}
