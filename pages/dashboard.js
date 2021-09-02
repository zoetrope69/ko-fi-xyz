import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

import useAPI from "../hooks/useAPI";

export default function Dashboard() {
  const router = useRouter();
  const { data: user, isLoading, error } = useAPI("/user");

  if (error) {
    console.error(error);
  }

  async function logout() {
    await fetch("/api/logout");
    router.push("/");
  }

  if (!isLoading && !user?.email) {
    return (
      <main>
        <Head>
          <title>Ko-fi Custom Alerts - Dashboard</title>
        </Head>

        <h1>Ko-fi Custom Alerts - Dashboard</h1>

        <p>Something went wrong. Try logging out...</p>
        <button onClick={logout}>Logout</button>
      </main>
    );
  }

  return (
    <main>
      <Head>
        <title>Ko-fi Custom Alerts - Dashboard</title>
      </Head>

      <h1>Ko-fi Custom Alerts - Dashboard</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {user && (
            <>
              <p>{user.email}</p>

              <button onClick={logout}>Logout</button>

              <h2>Getting Started</h2>

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
                    https://ko-fi-alerts.vercel.app/api/webhook/
                    {user.webhookId}
                  </code>
                </li>
                <li>
                  Go to OBS. Create a new browser source with this
                  URL:
                  <code>
                    https://ko-fi-alerts.vercel.app/overlay/
                    {user.overlayId}
                  </code>
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
              </ol>
            </>
          )}
          {!user && <Link href="/login">Login</Link>}
        </>
      )}
    </main>
  );
}
