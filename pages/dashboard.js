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

        {isLoading ? <p>Loading...</p> : <></>}
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
