import Iron from "@hapi/iron";
import { getAuthToken } from "./cookie";

const { ENCRYPTION_SECRET } = process.env;

export async function getAuthorisedUser(cookies) {
  let authorisedUser;

  try {
    authorisedUser = await Iron.unseal(
      getAuthToken(cookies),
      ENCRYPTION_SECRET,
      Iron.defaults
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
    throw new Error("Couldnt get authorised error");
  }

  return authorisedUser;
}
