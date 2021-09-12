import { useEffect, useReducer } from "react";

import { supabase } from "../helpers/supabase-clientside";
import logger from "../helpers/logger";

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
        is_shown: true,
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
    if (!overlayId) {
      return;
    }

    async function getExistingAlerts() {
      const { data: alerts, error } = await getAlerts(overlayId);

      if (error) {
        return logger.error(error);
      }

      if (!alerts || alerts.length === 0) {
        return;
      }

      alerts.forEach((alert) => {
        addToQueue(alert);
      });
    }
    getExistingAlerts();
  }, [overlayId]);

  useEffect(() => {
    if (!overlayId) {
      return;
    }

    const alertsSubscription = supabase
      .from(`alerts:overlay_id=eq.${overlayId}`)
      .on("INSERT", (payload) => {
        const newAlert = payload?.new;

        if (newAlert && !newAlert.is_shown) {
          addToQueue(newAlert);
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(alertsSubscription);
    };
  }, [overlayId]);

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

  return { queue, isRemoving };
}
