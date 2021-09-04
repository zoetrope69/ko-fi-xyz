import { getUserByEmail } from "./helpers/database";
import { getAuthorisedUser } from "./helpers/auth";

export default async function handler(request, response) {
  let authorisedUser;

  try {
    authorisedUser = await getAuthorisedUser(request.cookies);
  } catch (error) {
    return response.status(401).json({ error: error.message });
  }

  if (!authorisedUser || !authorisedUser.email) {
    return response.json({});
  }

  let user = {};
  try {
    user = await getUserByEmail(authorisedUser.email);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }

  response.json(user || {});
}
