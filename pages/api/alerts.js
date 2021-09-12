import {
  getNonShownAlertsByOverlayId,
  updateAlert,
} from "./helpers/supabase";

async function putHandler(request, response) {
  const { id, data } = request.body;

  if (!id || !data) {
    return response.status(400).json({ error: "No id or data" });
  }

  await updateAlert(id, data);

  response.end();
}

async function getHandler(request, response) {
  const { overlayId } = request.query;

  if (!overlayId) {
    return response.status(400).json({ error: "No overlayId" });
  }

  const alerts = await getNonShownAlertsByOverlayId(overlayId);
  if (!alerts) {
    return response.status(400).json({ error: "No alerts" });
  }

  response.json(alerts);
}

export default async function handler(request, response) {
  if (request.method === "PUT") {
    return putHandler(request, response);
  }

  return getHandler(request, response);
}
