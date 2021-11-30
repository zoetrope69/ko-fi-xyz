import { v4 as uuid } from "uuid";

const { SUPABASE_SERVICE_KEY, NEXT_PUBLIC_SUPABASE_URL } =
  process.env;

const { createClient } = require("@supabase/supabase-js");

import logger from "../../../helpers/logger";

export const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_KEY
);

async function createRow(column, data) {
  const rowId = data?.id || uuid();
  const newRow = { id: rowId, ...data };

  const { error } = await supabase.from(column).insert([newRow]);

  if (error) {
    logger.error(error.message);
    return null;
  }

  return rowId;
}

async function updateRow(column, data, options) {
  return supabase.from(column).update(data).match(options);
}

async function getSortedRows(
  column,
  options,
  [sortColumn, sortOptions]
) {
  const { data: rows, error } = await supabase
    .from(column)
    .select()
    .match(options)
    .order(sortColumn, sortOptions);

  if (error) {
    logger.error(error.message);
    return [];
  }

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows;
}

async function getRows(column, options) {
  const { data: rows, error } = await supabase
    .from(column)
    .select()
    .match(options);

  if (error) {
    logger.error(error.message);
    return [];
  }

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows;
}

async function getRow(column, options) {
  const [row] = await getRows(column, options);

  return row;
}

// users

export async function createUser(id, email) {
  const overlay_id = await createOverlay();

  return createRow("users", {
    id,
    email,
    webhook_id: uuid(),
    overlay_id,
  });
}

export async function getAuthorizedUserByToken(token) {
  return supabase.auth.api.getUser(token);
}

export async function getUserById(id) {
  return getRow("users", { id });
}

export async function getUserByWebhookId(webhook_id) {
  return getRow("users", { webhook_id });
}

// overlays

export async function createOverlay() {
  const data = {
    settings: {
      canPlaySounds: false,
      messageText: "{type} of {amount} from {from_name} {message}",
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
    },
  };

  return await createRow("overlays", data);
}

export async function getOverlayById(id) {
  return getRow("overlays", { id });
}

export async function updateOverlaySettings(id, settings) {
  return supabase.from("overlays").update({ settings }).eq("id", id);
}

// alerts

export async function getAlertsByOverlayId(overlay_id) {
  return getSortedRows("alerts", { overlay_id }, [
    "created_at",
    { ascending: false },
  ]);
}

export async function getNonShownAlertsByOverlayId(overlay_id) {
  return getSortedRows("alerts", { overlay_id, is_shown: false }, [
    "created_at",
    { ascending: false },
  ]);
}

export async function createAlert(data) {
  return createRow("alerts", data);
}

export async function updateAlert(id, data) {
  return updateRow("alerts", data, { id });
}
