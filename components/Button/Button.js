import React from "react";
import classNames from "classnames";

import styles from "./Button.module.css";

const Button = React.forwardRef((props, ref) => {
  const {
    children,
    href,
    isSmall,
    isSecondary,
    isTwitch,
    disabled,
    ...rest
  } = props;

  const className = classNames(styles.Button, {
    [styles["Button--small"]]: isSmall,
    [styles["Button--secondary"]]: isSecondary,
    [styles["Button--Twitch"]]: isTwitch,
    [styles["Button--disabled"]]: disabled,
  });

  if (href) {
    <a href={href} className={className} {...rest}>
      {children}
    </a>;
  }

  return (
    <button
      ref={ref}
      className={className}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
