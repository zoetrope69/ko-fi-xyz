import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import Alert from "../components/Alert/Alert";
import Button from "../components/Button/Button";
import Preview from "../components/Preview/Preview";

export default function Home() {
  return (
    <main>
      <Head>
        <title>Ko-fi XYZ</title>
      </Head>

      <h1>
        <Image src="/ko-fi-logo.png" alt="" width="30" height="30" />{" "}
        Ko-fi XYZ
      </h1>

      <p>
        Unofficial tools to help streamers use{" "}
        <a href="https://ko-fi.com/">Ko-fi</a>.
      </p>
      <p>
        Made by <a href="https://twitch.tv/zactopus">zactopus</a> to
        help people move away from sending Twitch/Amazon/The Bezos
        their money.
      </p>

      <Link href="/login" passHref>
        <Button>Get Started</Button>
      </Link>

      <hr />

      <h2>Alerts</h2>

      <p>
        Customisable alerts. Tweak colours, placement, wording and
        more...
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

      <h2>Custom OBS Menu</h2>

      <p>Get the alert list directly in OBS...</p>

      <Image
        src="/obs-screenshot.png"
        alt="A examples screenshot of alerts in OBS"
        width="302"
        height="398"
      />
    </main>
  );
}
