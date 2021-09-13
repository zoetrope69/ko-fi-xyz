import { useEffect, useState } from "react";

import { supabase } from "../helpers/supabase-clientside";

export default function useGetSession() {
  const [isGettingSession, setIsGettingSession] = useState(true);
  const [session, setSession] = useState();

  useEffect(() => {
    async function getSession() {
      const s = await supabase.auth.session();
      setSession(s);
      setIsGettingSession(false);
    }
    getSession();
  }, []);

  return { session, isGettingSession };
}
