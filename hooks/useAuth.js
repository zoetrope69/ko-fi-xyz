import useAPI from "./useAPI";

export default function useAuth() {
  const { data, error, isLoading } = useAPI("/user");
  return {
    user: data,
    error,
    isLoading,
  };
}
