import { useEffect, useReducer } from "react";

import logger from "../helpers/logger";

const POLL_FREQUENCY_MS = 5000;
const ALERT_DURATION_MS = 5000;
const ALERT_DELAY_LENGTH_MS = 1000;

async function getAlerts(overlayId) {
  const response = await fetch("/api/alerts?overlayId=" + overlayId);
  return response.json();
}

async function removeAlert(id) {
  return fetch("/api/alerts", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      data: {
        shown: true,
      },
    }),
  });
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      // don't add alerts we've already processed
      if (state.processedAlertIds.includes(action.alert.id)) {
        return state;
      }

      return {
        ...state,
        queue: [...state.queue, action.alert],
        processedAlertIds: [
          ...state.processedAlertIds,
          action.alert.id,
        ],
      };

    case "PROCESSING":
      return {
        ...state,
        isProcessing: true,
      };

    case "PROCESSED":
      return {
        ...state,
        isProcessing: false,
        isRemoving: true,
      };

    case "REMOVE":
      return {
        ...state,
        isRemoving: false,
        queue: state.queue.slice(1),
      };

    default:
      return state;
  }
}

export default function useAlertQueue({
  overlayId,
  messageDuration,
}) {
  const initialState = {
    isProcessing: false,
    isRemoving: false,
    queue: [],
    processedAlertIds: [],
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isProcessing, isRemoving, queue } = state;

  function addToQueue(alert) {
    dispatch({
      type: "ADD",
      alert,
    });
  }

  useEffect(() => {
    function getAlertDuration() {
      if (messageDuration) {
        return parseInt(messageDuration, 10) * 1000;
      }

      return ALERT_DURATION_MS;
    }

    if (queue.length > 0 && !isProcessing) {
      dispatch({
        type: "PROCESSING",
      });

      setTimeout(async () => {
        dispatch({
          type: "PROCESSED",
        });

        await removeAlert(queue[0].id);

        setTimeout(() => {
          dispatch({
            type: "REMOVE",
          });
        }, ALERT_DELAY_LENGTH_MS);
      }, getAlertDuration());
    }
  }, [messageDuration, queue, isProcessing]);

  useEffect(() => {
    if (!overlayId || !messageDuration) {
      return;
    }

    async function pollNewAlerts(overlayId) {
      if (!process.browser) {
        return;
      }

      const alerts = await getAlerts(overlayId);

      if (!alerts || alerts.length === 0 || !Array.isArray(alerts)) {
        return;
      }

      // TODO filter nonShown on database side
      const nonShownAlerts = alerts.filter(
        (alert) => alert.shown !== true
      );

      nonShownAlerts.forEach((newAlert) => {
        addToQueue(newAlert);
      });
    }

    logger.info("Polling for new alerts...");
    pollNewAlerts(overlayId);
    setInterval(() => {
      logger.info("Polling for new alerts...");
      pollNewAlerts(overlayId);
    }, POLL_FREQUENCY_MS);
  }, [overlayId, messageDuration]);

  return { queue, isRemoving };
}
