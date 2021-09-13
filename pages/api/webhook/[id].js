import faker from "faker";
import { getUserByWebhookId, createAlert } from "../helpers/supabase";

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

  const {
    amount,
    currency,
    from_name,
    is_first_subscription_payment,
    is_public,
    is_subscription_payment,
    message,
    timestamp,
    type,
  } = json;

  const alertData = {
    amount,
    currency,
    from_name,
    is_first_subscription_payment,
    is_public,
    is_subscription_payment,
    isTest,
    timestamp,
    type,
  };

  if (isTest) {
    alertData.message = faker.random.words();
  }

  // if is private delete data for message
  if (is_public && message && message.length > 0) {
    alertData.message = message;
  }

  try {
    const { error } = await createAlert({
      overlay_id: user.overlay_id,
      kofi_data: alertData,
      is_shown: false,
    });
    if (error) {
      logger.error(error.message);
    }
  } catch (e) {
    logger.error(e.message);
  }

  response.end();
}
