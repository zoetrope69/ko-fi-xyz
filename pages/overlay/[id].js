import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import useAlertQueue from "../../hooks/useAlertQueue";
import useAPI from "../../hooks/useAPI";

// const TYPES = [
//   "Donation",
//   "Subscription",
//   "Commission",
//   "Shop Order",
// ];

export default function Overlay() {
  const router = useRouter();
  const { id: overlayId } = router.query;
  const { queue, isRemoving } = useAlertQueue({ overlayId });
  const [currentAlert] = queue;

  const {
    isLoading,
    data: overlay,
    error,
  } = useAPI("/overlay/" + overlayId);

  useEffect(() => {
    if (overlay?.sound && currentAlert) {
      new Audio("/jingle.wav").play();
    }
  }, [currentAlert, overlay]);

  if (isLoading) {
    return null;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!overlay.id) {
    return <p>Error: No overlay</p>;
  }

  if (!currentAlert?.data?.message) {
    return null;
  }

  function getMoney() {
    if (
      !currentAlert?.data?.amount ||
      !currentAlert?.data?.currency
    ) {
      return "";
    }

    const { amount, currency } = currentAlert.data;
    const moneyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    });
    return moneyFormatter.format(amount);
  }

  return (
    <>
      <Head>
        <title>Ko-fi Custom Alerts - Overlay</title>
      </Head>

      <div
        className={`Alert ${isRemoving ? "Alert--isRemoving" : ""}`}
      >
        {getMoney()} from {currentAlert.data.from_name}
        <small className="AlertMessage">
          {currentAlert.data.message}
        </small>
      </div>
    </>
  );
}
