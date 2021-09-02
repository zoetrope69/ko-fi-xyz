import useSWR from "swr";

async function fetcher(route) {
  /* our token cookie gets sent with this request */
  const response = await fetch(route);

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

export default function useAPI(endpoint) {
  const { data, error } = useSWR("/api" + endpoint, fetcher);
  const isLoading = data === undefined && !error;

  return {
    data,
    error,
    isLoading,
  };
}
