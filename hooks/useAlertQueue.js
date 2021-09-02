import { useEffect, useReducer } from "react";

const POLL_FREQUENCY_MS = 5000;
const ALERT_LENGTH_MS = 5000;
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

export default function useAlertQueue({ overlayId }) {
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
      }, ALERT_LENGTH_MS);
    }
  }, [queue, isProcessing]);

  useEffect(() => {
    if (!overlayId) {
      return;
    }

    async function pollNewAlerts(overlayId) {
      if (!process.browser) {
        return;
      }

      const alerts = await getAlerts(overlayId);

      // TODO filter nonShown on database side
      const nonShownAlerts = alerts.filter(
        (alert) => alert.shown !== true
      );

      nonShownAlerts.forEach((newAlert) => {
        addToQueue(newAlert);
      });
    }

    console.info("Polling for new alerts...");
    pollNewAlerts(overlayId);
    setInterval(() => {
      console.info("Polling for new alerts...");
      pollNewAlerts(overlayId);
    }, POLL_FREQUENCY_MS);
  }, [overlayId]);

  return { queue, isRemoving };
}
