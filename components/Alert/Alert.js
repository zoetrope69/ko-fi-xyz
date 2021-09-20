import { useEffect, useState } from "react";
import Image from "next/image";
import classNames from "classnames";

import { getMoney } from "../../helpers/get-money";
import { supabase } from "../../helpers/supabase-clientside";
import logger from "../../helpers/logger";

import styles from "./Alert.module.css";

const ANIMATION_IN_DURATION_MS = 1000;

export default function Alert({
  settings,
  currentAlert,
  isRemoving,
}) {
  const [alertAudio, setAlertAudio] = useState();
  const { type, from_name, amount, currency, message } =
    currentAlert.kofi_data;

  useEffect(() => {
    let audioUrl = "/jingle.wav";

    if (settings?.customSoundUrl) {
      const { publicURL, error } = supabase.storage
        .from("sounds")
        .getPublicUrl(settings?.customSoundUrl);

      if (error) {
        logger.error(error.message);
      } else {
        audioUrl = publicURL;
      }
    }

    const newAudio = new Audio(audioUrl);
    newAudio.preload = "auto";
    setAlertAudio(newAudio);
  }, [settings?.customSoundUrl]);

  useEffect(() => {
    if (settings?.canPlaySounds && currentAlert?.id && alertAudio) {
      alertAudio.play();
    }
  }, [alertAudio, currentAlert?.id, settings]);

  function getMessageText() {
    if (settings?.messageText) {
      return settings.messageText;
    }

    return "{type} of {amount} from {from_name} - {message}";
  }

  const MESSAGE_FUNCTION_MAP = {
    "{amount}": () => getMoney({ amount, currency }) || "money",
    "{from_name}": () => from_name || "Someone",
    "{message}": () => message || "",
    "{type}": () => type || "Donation",
  };

  function getMessage() {
    const messageText = getMessageText();

    const regexp = new RegExp("{[A-z]+}", "g");
    const regexMatches = [...messageText.matchAll(regexp)];

    // no tags in message
    if (regexMatches.length === 0) {
      return messageText;
    }

    const matches = regexMatches.map((match) => {
      const [code] = match;
      const beforePosition = match.index;
      const afterPosition = beforePosition + code.length;
      return {
        code,
        beforePosition,
        afterPosition,
      };
    });

    const stringParts = [];
    let lastAfterPosition = 0;
    matches.forEach((match, i) => {
      const { code, beforePosition, afterPosition } = match;

      const beforeString = messageText.substr(
        lastAfterPosition,
        beforePosition - lastAfterPosition
      );

      lastAfterPosition = afterPosition;

      stringParts.push(beforeString);
      const messageFunction = MESSAGE_FUNCTION_MAP[code];
      if (messageFunction) {
        stringParts.push(messageFunction());
      } else {
        stringParts.push(code);
      }

      const isLastMatch = i === matches.length - 1;
      if (isLastMatch) {
        const afterString = messageText.substr(afterPosition);
        stringParts.push(afterString);
      }
    });

    return stringParts.join("").trim();
  }

  const inlineStyles = {
    animationDuration: `${ANIMATION_IN_DURATION_MS}ms`,
  };

  if (settings?.messageBackgroundColor) {
    inlineStyles.backgroundColor = settings?.messageBackgroundColor;
  }

  if (settings?.messageTextColor) {
    inlineStyles.color = settings?.messageTextColor;
  }

  if (settings?.messageSpacingHorizontal) {
    inlineStyles.marginLeft = `${settings?.messageSpacingHorizontal}px`;
    inlineStyles.marginRight = `${settings?.messageSpacingHorizontal}px`;
  }

  if (settings?.messageSpacingVertical) {
    inlineStyles.marginTop = `${settings?.messageSpacingVertical}px`;
    inlineStyles.marginBottom = `${settings?.messageSpacingVertical}px`;
  }

  if (
    settings?.messageAnimationType &&
    settings?.messageAnimationDirection
  ) {
    if (settings.messageAnimationType === "fade") {
      if (isRemoving) {
        inlineStyles.animationName = "fade-out";
      } else {
        inlineStyles.animationName = "fade";
      }
    } else {
      if (isRemoving) {
        inlineStyles.animationName = `${settings.messageAnimationType}-${settings.messageAnimationDirection}-out`;
      } else {
        inlineStyles.animationName = `${settings.messageAnimationType}-${settings.messageAnimationDirection}-in`;
      }
    }
  }

  if (settings?.messageShowIcon) {
    inlineStyles.paddingLeft = "0.85em";
  }

  if (!settings?.messageHasCurvedCorners) {
    inlineStyles.borderRadius = "0";
  }

  const className = classNames(styles.Alert, {
    [styles["Alert--isRemoving"]]: isRemoving,
    [styles["Alert--position-top-left"]]:
      settings?.messagePosition === "top-left",
    [styles["Alert--position-top-right"]]:
      settings?.messagePosition === "top-right",
    [styles["Alert--position-bottom-left"]]:
      settings?.messagePosition === "bottom-left",
    [styles["Alert--position-bottom-right"]]:
      settings?.messagePosition === "bottom-right",
  });

  return (
    <div className={className} style={inlineStyles}>
      {settings?.messageShowIcon && (
        <div className={styles.AlertIcon}>
          <Image
            src="/ko-fi-logo-cup.png"
            alt=""
            height="50"
            width="50"
            loading="eager"
            priority
          />
        </div>
      )}
      {getMessage()}
    </div>
  );
}
