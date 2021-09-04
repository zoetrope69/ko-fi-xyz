import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import { getDIDWithEmail } from "../helpers/auth";

export default function Login() {
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
        <title>Ko-fi Custom Alerts - Login/Signup</title>
      </Head>

      <h1>Ko-fi Custom Alerts</h1>

      <h2>Login/Signup</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input name="email" type="email" />
        <button disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
}
