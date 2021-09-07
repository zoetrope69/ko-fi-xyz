import { v4 as uuid } from "uuid";
import {
  getByIndex,
  getByCollectionId,
  getAllByIndex,
  createDocument,
  updateDocument,
} from "./faunadb";

export async function getUserByEmail(email) {
  return getByIndex("user_by_email", email);
}

export async function getUserByWebhookId(webhookId) {
  return getByIndex("user_by_webhook_id", webhookId);
}

export async function getOverlayById(id) {
  return getByCollectionId("overlays", id);
}

export async function getAlertsByOverlayId(overlayId) {
  return getAllByIndex("alerts_by_overlay_id", overlayId);
}

export async function createAlert(data) {
  return createDocument("alerts", data);
}

export async function updateAlert(id, data) {
  return updateDocument("alerts", id, data);
}

export async function createOverlay() {
  return createDocument("overlays", {
    canPlaySounds: false,
    messageText: "{type} of {amount} from {from_name} - {message}",
    messageDuration: "5",
    messageBackgroundColor: "#f8befc",
    messageTextColor: "#840042",
    messagePosition: "top-left",
    messageSpacingHorizontal: "50",
    messageSpacingVertical: "50",
    messageAnimationType: "slide",
    messageAnimationDirection: "left",
    messageShowIcon: false,
    messageHasCurvedCorners: true,
  });
}

export async function createUser(email) {
  const overlayId = await createOverlay();

  return createDocument("users", {
    email,
    webhookId: uuid(),
    overlayId,
  });
}

export async function updateOverlay(id, data) {
  return updateDocument("overlays", id, data);
}
