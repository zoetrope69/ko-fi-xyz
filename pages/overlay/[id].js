import { useRouter } from "next/router";
import Head from "next/head";

import Alert from "../../components/alert";
import useAlertQueue from "../../hooks/useAlertQueue";
import useAPI from "../../hooks/useAPI";

import logger from "../../helpers/logger";

export default function Overlay() {
  const router = useRouter();
  const { id: overlayId = null } = router.query;
  const {
    isLoading,
    data: overlay,
    error,
  } = useAPI(overlayId ? "/api/overlays/" + overlayId : null, {
    refreshInterval: 1000,
  });

  const { queue, isRemoving } = useAlertQueue({
    overlayId: overlay?.id,
    messageDuration: overlay?.messageDuration,
  });
  const [currentAlert] = queue;

  if (isLoading) {
    return null;
  }

  if (error) {
    logger.error(error);
    return <p>Error: Something went wrong</p>;
  }

  if (!overlay.id) {
    return <p>Error: No overlay</p>;
  }

  if (!currentAlert) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Ko-fi Custom Alerts - Overlay</title>
      </Head>

      <Alert
        currentAlert={currentAlert}
        overlay={overlay}
        isRemoving={isRemoving}
      />
    </>
  );
}
