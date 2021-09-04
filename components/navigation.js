import { useRouter } from "next/router";
import Link from "next/link";

export default function Navigation({ user, isLoading }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout");
    router.push("/");
  }

  return (
    <nav>
      <h1>Ko-fi Custom Alerts</h1>

      {!isLoading && (
        <>
          <p>{user.email}</p>

          <button onClick={logout}>Logout</button>

          <ul>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
            </li>
          </ul>
        </>
      )}
    </nav>
  );
}
