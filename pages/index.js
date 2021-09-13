import Head from "next/head";
import Link from "next/link";

import Alert from "../components/Alert/Alert";
import Button from "../components/Button/Button";
import Preview from "../components/Preview/Preview";

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

      <Preview>
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
      </Preview>

      <Link href="/login" passHref>
        <Button>Get Started</Button>
      </Link>
    </main>
  );
}
