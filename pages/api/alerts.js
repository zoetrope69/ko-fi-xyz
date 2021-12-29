import {
  getAuthorizedUserByToken,
  getAlerts,
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

function getIsShown({ isAuthorised, isShown }) {
  if (!isAuthorised) {
    return false;
  }

  // not set in request
  if (typeof isShown === "undefined") {
    return undefined;
  }

  return isShown === "true";
}

async function getHandler(request, response) {
  const { overlayId, sinceDate, isAscending, isShown } =
    request.query;
  const token = getToken(request);

  if (!overlayId) {
    return response.status(400).json({ error: "No overlayId" });
  }

  const { data: authorisedUser } = await getAuthorizedUserByToken(
    token
  );
  const isAuthorised = !!authorisedUser?.id;

  const alerts = await getAlerts({
    overlayId,
    sinceDate,
    isAscending: isAscending === "true",
    isShown: getIsShown({ isAuthorised, isShown }),
  });
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
