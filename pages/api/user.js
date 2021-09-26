import {
  getUserById,
  getAuthorizedUserByToken,
} from "./helpers/supabase";

function getToken(request) {
  if (!request.headers?.authorization) {
    return null;
  }

  return request.headers.authorization.replace("Bearer", "").trim();
}

export default async function handler(request, response) {
  const token = getToken(request);

  const { data: authorisedUser, error } =
    await getAuthorizedUserByToken(token);

  if (error) {
    return response.status(401).json({ error: error.message });
  }

  if (!authorisedUser || !authorisedUser.id) {
    return response.json({});
  }

  let user = {};
  try {
    user = await getUserById(authorisedUser.id);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }

  if (!user) {
    return response.json({});
  }

  // strip out email for safety
  response.json({ ...user, email: undefined });
}
