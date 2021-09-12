import { useEffect } from "react";
import Image from "next/image";
import classNames from "classnames";

const ANIMATION_IN_DURATION_MS = 1000;

export default function Alert({
  settings,
  currentAlert,
  isRemoving,
}) {
  const { type, from_name, amount, currency, message } =
    currentAlert.kofi_data;

  useEffect(() => {
    if (settings?.canPlaySounds && currentAlert) {
      setTimeout(() => {
        new Audio("/jingle.wav").play();
      }, ANIMATION_IN_DURATION_MS * 0.5); // a little before it arrives in
    }
  }, [currentAlert, settings]);

  function getMoney() {
    if (!amount || !currency) {
      return "money";
    }

    const moneyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    });
    return moneyFormatter.format(amount);
  }

  function getMessageText() {
    if (settings?.messageText) {
      return settings.messageText;
    }

    return "{type} of {amount} from {from_name} - {message}";
  }

  const MESSAGE_FUNCTION_MAP = {
    "{amount}": () => getMoney(),
    "{from_name}": () => from_name || "Someone",
    "{message}": () => message || "",
    "{type}": () => type || "Donation",
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

  const styles = {
    animationDuration: `${ANIMATION_IN_DURATION_MS}ms`,
  };

  if (settings?.messageBackgroundColor) {
    styles.backgroundColor = settings?.messageBackgroundColor;
  }

  if (settings?.messageTextColor) {
    styles.color = settings?.messageTextColor;
  }

  if (settings?.messageSpacingHorizontal) {
    styles.marginLeft = `${settings?.messageSpacingHorizontal}px`;
    styles.marginRight = `${settings?.messageSpacingHorizontal}px`;
  }

  if (settings?.messageSpacingVertical) {
    styles.marginTop = `${settings?.messageSpacingVertical}px`;
    styles.marginBottom = `${settings?.messageSpacingVertical}px`;
  }

  if (
    settings?.messageAnimationType &&
    settings?.messageAnimationDirection
  ) {
    if (settings.messageAnimationType === "fade") {
      if (isRemoving) {
        styles.animationName = "fade-out";
      } else {
        styles.animationName = "fade";
      }
    } else {
      if (isRemoving) {
        styles.animationName = `${settings.messageAnimationType}-${settings.messageAnimationDirection}-out`;
      } else {
        styles.animationName = `${settings.messageAnimationType}-${settings.messageAnimationDirection}-in`;
      }
    }
  }

  if (settings?.messageShowIcon) {
    styles.paddingLeft = "0.85em";
  }

  if (!settings?.messageHasCurvedCorners) {
    styles.borderRadius = "0";
  }

  const className = classNames("Alert", {
    "Alert--isRemoving": isRemoving,
    "Alert--position-top-left":
      settings?.messagePosition === "top-left",
    "Alert--position-top-right":
      settings?.messagePosition === "top-right",
    "Alert--position-bottom-left":
      settings?.messagePosition === "bottom-left",
    "Alert--position-bottom-right":
      settings?.messagePosition === "bottom-right",
  });

  return (
    <div className={className} style={styles}>
      {settings?.messageShowIcon && (
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
      {getMessage()}
    </div>
  );
}
