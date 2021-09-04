import { getUserByEmail, updateOverlay } from "../helpers/database";
import { getAuthorisedUser } from "../helpers/auth";

import logger from "../../../helpers/logger";

export default async function handler(request, response) {
  if (request.method !== "PUT") {
    return response
      .status(400)
      .json({ error: "Something went wrong" });
  }

  let authorisedUser;

  try {
    authorisedUser = await getAuthorisedUser(request.cookies);
  } catch (error) {
    logger.error(error);
    return response.status(401).json({ error: error.message });
  }

  if (!authorisedUser || !authorisedUser.email) {
    return response.json({});
  }

  let user = {};
  try {
    user = await getUserByEmail(authorisedUser.email);
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error: error.message });
  }

  const { id: overlayId, data } = request.body;

  if (overlayId !== user.overlayId) {
    logger.error("Wrong user for overlay id");
    // just to make sure we're sending the right data to the right user
    return response
      .status(400)
      .json({ error: "Something went wrong" });
  }

  await updateOverlay(overlayId, data);

  return response.json({});
}
