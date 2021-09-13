import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import { signOut } from "../helpers/supabase-clientside";
import logger from "../helpers/logger";

export default function Navigation({ user, isLoading }) {
  const router = useRouter();

  async function logout() {
    const { error } = await signOut();

    if (error) {
      return logger.error(error);
    }

    router.push("/");
  }

  return (
    <nav>
      <div className="NavTitle">
        <Image
          className="NavTitleLogo"
          src="/ko-fi-logo.png"
          alt="Ko-fi Logo"
          width="30"
          height="30"
        />{" "}
        <h1 className="NavTitleText">Ko-fi Custom Alerts</h1>
      </div>

      {!isLoading && (
        <div className="NavUserInfo">
          {user && <p>{user.email}</p>}

          <button
            className="Button Button--small Button--secondary"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}

      <ul>
        <li>
          <Link href="/getting-started">Getting Started</Link>
        </li>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/settings">Settings</Link>
        </li>
      </ul>

      <div className="NavSupportContainer">
        <a
          className="NavSupport NavSupport--discord"
          href="https://discord.gg/D4T25jyCRU"
        >
          <Image
            className="NavSupportIcon"
            src="/discord-logo.png"
            alt=""
            width="30"
            height="30"
          />
          Need help? Feedback?
          <br /> Let Zac know on Discord
        </a>

        <a
          className="NavSupport NavSupport--ko-fi"
          href="https://ko-fi.com/zactopus"
        >
          <Image
            className="NavSupportIcon"
            src="/ko-fi-logo-cup.png"
            alt=""
            width="30"
            height="30"
          />
          Support zactopus on Ko-fi
        </a>
      </div>
    </nav>
  );
}
