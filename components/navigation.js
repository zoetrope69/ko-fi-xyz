import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

export default function Navigation({ user, isLoading }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout");
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
          <p>{user.email}</p>

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
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/settings">Settings</Link>
        </li>
      </ul>

      <a
        className="NavSupportZactopus"
        href="https://ko-fi.com/zactopus"
      >
        <Image
          className="NavSupportZactopusIcon"
          src="/ko-fi-logo-cup.png"
          alt=""
          width="30"
          height="30"
        />
        Support zactopus on Ko-fi
      </a>
    </nav>
  );
}
