import { useEffect } from "react";
import Image from "next/image";
import classNames from "classnames";

const ANIMATION_IN_DURATION_MS = 1000;

export default function Alert({ overlay, currentAlert, isRemoving }) {
  useEffect(() => {
    if (overlay?.canPlaySounds && currentAlert) {
      setTimeout(() => {
        new Audio("/jingle.wav").play();
      }, ANIMATION_IN_DURATION_MS * 0.5); // a little before it arrives in
    }
  }, [currentAlert, overlay]);

  function getMoney() {
    if (
      !currentAlert?.data?.amount ||
      !currentAlert?.data?.currency
    ) {
      return "money";
    }

    const { amount, currency } = currentAlert.data;
    const moneyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    });
    return moneyFormatter.format(amount);
  }

  function getMessageText() {
    if (overlay.messageText) {
      return overlay.messageText;
    }

    return "{type} of {amount} from {from_name} - {message}";
  }

  const MESSAGE_FUNCTION_MAP = {
    "{amount}": () => getMoney(),
    "{from_name}": () => currentAlert?.data?.from_name || "Someone",
    "{message}": () => currentAlert?.data?.message || "",
    "{type}": () => currentAlert?.data?.type || "Donation",
  };

  function getMessage() {
    const messageText = getMessageText();

    const regexp = new RegExp("{[A-z]+}", "g");
    const regexMatches = messageText.matchAll(regexp);

    const matches = [];
    for (const match of regexMatches) {
      const [code] = match;
      const beforePosition = match.index;
      const afterPosition = beforePosition + code.length;
      matches.push({
        code,
        beforePosition,
        afterPosition,
      });
    }

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

  const message = getMessage();

  const styles = {
    animationDuration: `${ANIMATION_IN_DURATION_MS}ms`,
  };

  if (overlay?.messageBackgroundColor) {
    styles.backgroundColor = overlay?.messageBackgroundColor;
  }

  if (overlay?.messageTextColor) {
    styles.color = overlay?.messageTextColor;
  }

  if (overlay?.messageSpacingHorizontal) {
    styles.marginLeft = `${overlay?.messageSpacingHorizontal}px`;
    styles.marginRight = `${overlay?.messageSpacingHorizontal}px`;
  }

  if (overlay?.messageSpacingVertical) {
    styles.marginTop = `${overlay?.messageSpacingVertical}px`;
    styles.marginBottom = `${overlay?.messageSpacingVertical}px`;
  }

  if (
    overlay?.messageAnimationType &&
    overlay?.messageAnimationDirection
  ) {
    if (overlay.messageAnimationType === "fade") {
      styles.animationName = "fade";
    } else if (isRemoving) {
      styles.animationName = `${overlay.messageAnimationType}-${overlay.messageAnimationDirection}-out`;
    } else {
      styles.animationName = `${overlay.messageAnimationType}-${overlay.messageAnimationDirection}-in`;
    }
  }

  if (overlay?.messageShowIcon) {
    styles.paddingLeft = "0.85em";
  }

  if (!overlay?.messageHasCurvedCorners) {
    styles.borderRadius = "0";
  }

  const className = classNames("Alert", {
    "Alert--isRemoving": isRemoving,
    "Alert--position-top-left":
      overlay?.messagePosition === "top-left",
    "Alert--position-top-right":
      overlay?.messagePosition === "top-right",
    "Alert--position-bottom-left":
      overlay?.messagePosition === "bottom-left",
    "Alert--position-bottom-right":
      overlay?.messagePosition === "bottom-right",
  });

  return (
    <div className={className} style={styles}>
      {overlay?.messageShowIcon && (
        <div className="AlertIcon">
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
      {message}
    </div>
  );
}
