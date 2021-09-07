import Head from "next/head";
import Link from "next/link";

import Alert from "../components/alert";

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
        An unofficial work-in-progress way to get custom Ko-fi alerts
        in your OBS set-up
      </p>
      <p>
        Made by <a href="https://twitch.tv/zactopus">zactopus</a>.
      </p>

      <div className="PreviewContainer">
        <div className="Preview">
          <Alert
            currentAlert={{
              data: {
                amount: 3.0,
                currency: "GBP",
                from_name: "Mr Blobby",
                message: "Hello there",
                type: "Donation",
              },
            }}
            overlay={{
              // disable sounds in preview
              canPlaySounds: false,
            }}
            isRemoving={false}
          />
        </div>
      </div>

      <Link href="/login" className="Button" passHref>
        <div className="Button">Get Started</div>
      </Link>
    </main>
  );
}
