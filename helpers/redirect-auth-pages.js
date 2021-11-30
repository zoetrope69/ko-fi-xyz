import { supabase } from "./supabase-clientside.js";

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

export async function redirectToDashboardPageIfLoggedIn(req) {
  const { user: authorisedUser } =
    await supabase.auth.api.getUserByCookie(req);

  if (authorisedUser) {
    // If user, redirect to dashboard.
    return {
      props: {},
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  // if not logged in continue as normal
  return { props: {} };
}
