import { supabase } from "./supabase-clientside";

export function getRedirectURL(pathName) {
  return `/login?redirectTo=${encodeURIComponent(pathName)}`;
}

export async function redirectAuthedPages(req) {
  const { user: authorisedUser } =
    await supabase.auth.api.getUserByCookie(req);

  if (!authorisedUser) {
    // If no user, redirect to index.
    return {
      props: {},
      redirect: {
        destination: getRedirectURL(req.url),
        permanent: false,
      },
    };
  }

  // If there is a user, return it.
  return { props: { authorisedUser } };
}
