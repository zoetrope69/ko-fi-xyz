import { useEffect, useReducer, useState } from "react";

import useAPI from "../hooks/useAPI.js";

import logger from "../helpers/logger.js";

const ALERT_DURATION_MS = 5000;
const ALERT_DELAY_LENGTH_MS = 1000;

async function removeAlert(id) {
  return fetch("/api/alerts", {
    method: "PUT",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    credentials: "same-origin",
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

  const [sinceDate, setSinceDate] = useState("");
  const url = `/api/alerts?overlayId=${overlayId}&sinceDate=${sinceDate}&ascending=true`;
  const { data: allAlerts = [] } = useAPI(overlayId ? url : null, {
    refreshInterval: 1000,
  });

  function addToQueue(alert) {
    dispatch({
      type: "ADD",
      alert,
    });
  }

  useEffect(() => {
    setSinceDate(new Date().toISOString());
  }, [setSinceDate]);

  useEffect(() => {
    allAlerts.forEach((alert) => {
      addToQueue(alert);
    });
  }, [allAlerts]);

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

        try {
          await removeAlert(queue[0].id);
        } catch (e) {
          logger.error("Couldnt remove alert");
          logger.error(e.message);
        }

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
