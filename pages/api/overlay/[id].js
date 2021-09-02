import { getOverlayById } from "../helpers/database";

export default async function handler(request, response) {
  const { id: overlayId } = request.query;
  if (!overlayId) {
    return response.status(400).json({ error: "No id" });
  }

  const overlay = await getOverlayById(overlayId);
  if (!overlay) {
    return response.status(400).json({ error: "No overlay" });
  }

  response.json(overlay);
}
