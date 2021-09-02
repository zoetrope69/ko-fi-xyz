import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react/cjs/react.development";

import { getDIDWithEmail } from "./helpers/auth";

export default function LoginSignup({ type }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    const { elements } = event.target;

    const did = await getDIDWithEmail(elements.email.value);

    const authRequest = await fetch("/api/login", {
      method: "POST",
      headers: { Authorization: `Bearer ${did}` },
    });

    if (authRequest.ok) {
      router.push("/dashboard");
    } else {
      console.error(authRequest.statusText);
      setIsLoading(false);
    }
  };

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
        <title>
          Ko-fi Custom Alerts -{" "}
          {type === "signup" ? "Signup" : "Login"}
        </title>
      </Head>

      <h1>
        Ko-fi Custom Alerts - {type === "signup" ? "Signup" : "Login"}
      </h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input name="email" type="email" />
        <button disabled={isLoading}>
          {type === "signup" && isLoading ? "Signing in..." : ""}
          {type !== "signup" && isLoading ? "Logging in..." : ""}
          {type === "signup" && !isLoading ? "Signup" : ""}
          {type !== "signup" && !isLoading ? "Login" : ""}
        </button>
      </form>
    </main>
  );
}
