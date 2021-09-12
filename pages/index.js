import Head from "next/head";
import Link from "next/link";

import Alert from "../components/alert";

export default function Home() {
  return (
    <main>
      <Head>
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
              kofi_data: {
                amount: 3.0,
                currency: "GBP",
                from_name: "Mr Blobby",
                message: "Hello there",
                type: "Donation",
              },
            }}
            settings={{
              messageHasCurvedCorners: true,
              // disable sounds in preview
              canPlaySounds: false,
            }}
            isRemoving={false}
          />
        </div>
      </div>

      <Link href="/login" passHref>
        <div className="Button">Get Started</div>
      </Link>
    </main>
  );
}
