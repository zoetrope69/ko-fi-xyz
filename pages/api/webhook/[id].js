import faker from "faker";
import { getUserByWebhookId, createAlert } from "../helpers/database";

import logger from "../../../helpers/logger";

export default async function handler(request, response) {
  const { id: webhookId } = request.query;

  if (!webhookId) {
    logger.error("Missing ID");
    return response.status(400).end();
  }

  const user = await getUserByWebhookId(webhookId);

  if (!user) {
    logger.error("No user with webhook ID of", webhookId);
    return response.status(400).end();
  }

  if (!request?.body?.data) {
    logger.error("No data from Ko-fi");
    return response.status(400).end();
  }

  let json = {};
  try {
    json = JSON.parse(request.body.data);
  } catch (e) {
    logger.error("Invalid data from Ko-fi", e.message);
    return response.status(400).end();
  }

  const TEST_KO_FI_ID = "1234-1234-1234-1234";
  const isTest = json.kofi_transaction_id === TEST_KO_FI_ID;

  const alertData = {
    ...json,
    isTest,
  };

  if (isTest) {
    alertData.message = faker.random.words();
  }

  // if is private delete data for message
  if (!json.is_public) {
    alertData.message = undefined;
  }

  try {
    await createAlert({
      webhookId,
      overlayId: user.overlayId,
      data: alertData,
      shown: false,
    });
  } catch (e) {
    logger.error(e.message);
  }

  response.end();
}
