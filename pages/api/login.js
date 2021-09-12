import {
  createUser,
  getUserById,
  getAuthorizedUserByToken,
  supabase,
} from "./helpers/supabase";

import logger from "../../helpers/logger";

function getToken(request) {
  if (!request.headers?.authorization) {
    return null;
  }

  return request.headers.authorization.replace("Bearer", "").trim();
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).end();
  }

  const token = getToken(request);

  const { data: authorisedUser, error } =
    await getAuthorizedUserByToken(token);

  if (error) {
    logger.error(error.message);
    return response.status(400).end();
  }

  if (!authorisedUser.id) {
    return response.end();
  }

  await supabase.auth.api.setAuthCookie(request, response);

  // check if user already exists
  const existingUser = await getUserById(authorisedUser.id);
  if (existingUser) {
    return response.end();
  }

  try {
    await createUser(authorisedUser.id, authorisedUser.email);
  } catch (e) {
    logger.log("Creating user error: ", e.message);
  }

  response.end();
}
