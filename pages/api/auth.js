import { supabase } from "./helpers/supabase";

export default async function handler(request, response) {
  supabase.auth.api.setAuthCookie(request, response);
}
