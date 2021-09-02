import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (document.cookie && document.cookie.includes('authed')) {
                window.location.href = "/dashboard"
              }
            `,
          }}
        />
        <title>Ko-fi Custom Alerts</title>
      </Head>
      <h1>Ko-fi Custom Alerts</h1>
      <p>
        A work-in-progress way to get custom Ko-fi alerts in your OBS
        set-up
      </p>
      <p>
        Made by <a href="https://twitch.tv/zactopus">zactopus</a>.
      </p>
      <br />

      <Link href="/login" className="Button" passHref>
        <div className="Button">Login</div>
      </Link>
      <br />
      <Link href="/login" className="Button" passHref>
        <div className="Button">Signup</div>
      </Link>
    </main>
  );
}
