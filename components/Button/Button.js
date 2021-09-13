import classNames from "classnames";

import styles from "./Button.module.css";

export default function Button({
  children,
  isSmall,
  isSecondary,
  isTwitch,
  disabled,
  ...rest
}) {
  return (
    <button
      className={classNames(styles.Button, {
        [styles["Button--small"]]: isSmall,
        [styles["Button--secondary"]]: isSecondary,
        [styles["Button--Twitch"]]: isTwitch,
        [styles["Button--disabled"]]: disabled,
      })}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
