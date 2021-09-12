import useSWR from "swr";

import useGetSession from "./useGetSession";

async function fetcher(route, token) {
  const response = await fetch(route, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const json = await response.json();

  if (!response.ok) {
    if (json.error) {
      throw new Error(json.error);
    }

    return null;
  }

  return json || null;
}

function getSWRFirstParam(endpoint, session) {
  if (!endpoint || !session?.access_token) {
    return null;
  }

  if (typeof endpoint === "function") {
    return () => [endpoint(), session.access_token];
  }

  return [endpoint, session.access_token];
}

export default function useAPI(endpoint, options = {}) {
  const session = useGetSession();

  const firstParam = getSWRFirstParam(endpoint, session);
  const { data, error, mutate, isValidating } = useSWR(
    firstParam,
    fetcher,
    options
  );

  return {
    data,
    error,
    isLoading: !data && !error,
    isValidating,
    mutate,
  };
}
