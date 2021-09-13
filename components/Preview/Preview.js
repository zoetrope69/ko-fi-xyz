import classNames from "classnames";

import styles from "./Preview.module.css";

export default function Preview({ children, isBig }) {
  return (
    <div
      className={classNames(styles.PreviewContainer, {
        [styles["PreviewContainer--big"]]: isBig,
      })}
    >
      <div className={styles.Preview}>{children}</div>
    </div>
  );
}
