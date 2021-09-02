import Iron from "@hapi/iron";
import { getAuthToken } from "./helpers/cookie";
import { getUserByEmail } from "./helpers/database";

const { ENCRYPTION_SECRET } = process.env;

export default async function handler(request, response) {
  let authorisedUser;

  try {
    authorisedUser = await Iron.unseal(
      getAuthToken(request.cookies),
      ENCRYPTION_SECRET,
      Iron.defaults
    );
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
