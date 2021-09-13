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

function getSWRFirstParam(endpoint, session, isGettingSession) {
  if (!endpoint || isGettingSession) {
    return null;
  }

  if (!session?.access_token) {
    return endpoint;
  }

  if (typeof endpoint === "function") {
    return () => [endpoint(), session.access_token];
  }

  return [endpoint, session.access_token];
}

export default function useAPI(endpoint, options = {}) {
  const { session, isGettingSession } = useGetSession();

  const firstParam = getSWRFirstParam(
    endpoint,
    session,
    isGettingSession
  );
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
