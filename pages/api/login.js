import { Magic } from "@magic-sdk/admin";
import Iron from "@hapi/iron";
import { setTokenCookie } from "./helpers/cookie";
import { getUserByEmail, createUser } from "./helpers/database";

const { ENCRYPTION_SECRET, MAGIC_SECRET_API_KEY } = process.env;

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return res.status(405).end();
  }

  if (!request.headers.authorization) {
    return response.end();
  }

  const did = request.headers.authorization
    .split("Bearer")
    .pop()
    .trim();
  const authorisedUser = await new Magic(
    MAGIC_SECRET_API_KEY
  ).users.getMetadataByToken(did);

  const token = await Iron.seal(
    authorisedUser,
    ENCRYPTION_SECRET,
    Iron.defaults
  );
  setTokenCookie(response, token);

  if (!authorisedUser.email) {
    return response.end();
  }

  // check if user already exists
  const existingUser = await getUserByEmail(authorisedUser.email);
  if (existingUser) {
    return response.end();
  }

  try {
    await createUser(authorisedUser.email);
  } catch (e) {
    console.log("Creating user error: ", e.message);
  }

  response.end();
}
