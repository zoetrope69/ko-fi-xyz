import {
  getUserById,
  updateOverlaySettings,
  getAuthorizedUserByToken,
} from "../helpers/supabase.js";

import logger from "../../../helpers/logger.js";

function getToken(request) {
  if (!request.headers?.authorization) {
    return null;
  }

  return request.headers.authorization.replace("Bearer", "").trim();
}

export default async function handler(request, response) {
  if (request.method !== "PUT") {
    return response
      .status(400)
      .json({ error: "Something went wrong" });
  }

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
    logger.error(error);
    return response.status(400).json({ error: error.message });
  }

  const { id: overlayId, settings } = request.body;

  if (overlayId !== user.overlay_id) {
    logger.error("Wrong user for overlay id");
    // just to make sure we're sending the right data to the right user
    return response
      .status(400)
      .json({ error: "Something went wrong" });
  }

  const { error: updateError } = await updateOverlaySettings(
    overlayId,
    settings
  );

  if (updateError) {
    return response.status(300).json({ error: updateError });
  }

  return response.status(200).end();
}
