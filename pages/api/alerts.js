import {
  getAuthorizedUserByToken,
  getNonShownAlertsByOverlayId,
  getAlertsByOverlayId,
  updateAlert,
} from "./helpers/supabase.js";

async function putHandler(request, response) {
  const { id, data } = request.body;

  if (!id || !data) {
    return response.status(400).json({ error: "No id or data" });
  }

  await updateAlert(id, data);

  response.end();
}

function getToken(request) {
  if (!request.headers?.authorization) {
    return null;
  }

  return request.headers.authorization.replace("Bearer", "").trim();
}

async function getHandler(request, response) {
  const { overlayId, sinceDate, ascending } = request.query;
  const token = getToken(request);

  if (!overlayId) {
    return response.status(400).json({ error: "No overlayId" });
  }

  const { data: authorisedUser, error } =
    await getAuthorizedUserByToken(token);

  if (error) {
    return response.status(401).json({ error: error.message });
  }

  if (!authorisedUser || !authorisedUser.id) {
    const alerts = await getNonShownAlertsByOverlayId(
      overlayId,
      sinceDate,
      ascending === "true"
    );
    if (!alerts) {
      return response.status(400).json({ error: "No alerts" });
    }

    return response.json(alerts);
  }

  const alerts = await getAlertsByOverlayId(
    overlayId,
    sinceDate,
    ascending === "true"
  );
  if (!alerts) {
    return response.status(400).json({ error: "No alerts" });
  }

  return response.json(alerts);
}

export default async function handler(request, response) {
  if (request.method === "PUT") {
    return putHandler(request, response);
  }

  return getHandler(request, response);
}
