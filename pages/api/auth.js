import { supabase } from "./helpers/supabase";

export default async function handler(request, response) {
  await supabase.auth.api.setAuthCookie(request, response);
  response.status(200).end();
}
