import Link from "next/link";
import Head from "next/head";

import Navigation from "../components/navigation";

import { supabase } from "../helpers/supabase-clientside";
import useAPI from "../hooks/useAPI";

const DEFAULT_DOMAIN = "https://ko-fi.xyz";

function getDomain() {
  if (!process.browser) {
    return DEFAULT_DOMAIN;
  }

  return window?.location?.origin || DEFAULT_DOMAIN;
}

export default function Dashboard() {
  const { data: user, isLoading } = useAPI("/api/user");
  const domain = getDomain();

  if (!isLoading && !user?.email) {
    return (
      <div className="wrapper">
        <Head>
          <title>Ko-fi Custom Alerts - Dashboard</title>
        </Head>

        <Navigation user={user} isLoading={isLoading} />

        <main>
          <h1>Ko-fi Custom Alerts - Dashboard</h1>

          <p>Something went wrong. Try logging out...</p>
        </main>
      </div>
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
          <p>Loading...</p>
        ) : (
          <>
            {user && (
              <>
                <h3>Getting Started</h3>

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
                <div className="Button">Home</div>
              </Link>
            )}
          </>
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
      redirect: { destination: "/login", permanent: false },
    };
  }

  // If there is a user, return it.
  return { props: { authorisedUser } };
}
