import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY
);

export async function signIn(options) {
  if (!supabase) {
    return { error: "No client" };
  }

  return supabase.auth.signIn(options, {
    redirectTo: window.location.origin + "/auth",
  });
}

export async function getUser() {
  if (!supabase) {
    return { error: "No client" };
  }

  return supabase.auth.user();
}

export async function signOut() {
  return supabase.auth.signOut();
}
