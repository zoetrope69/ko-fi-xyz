import Image from "next/image";
import classNames from "classnames";

import styles from "./Logo.module.css";

export default function Logo({ isSmall = false }) {
  const logoTextClassName = classNames(styles.LogoText, {
    [styles.LogoTextSmall]: isSmall,
  });
  return (
    <div className={styles.Logo}>
      <Image
        src="/ko-fi-logo.png"
        alt="Ko-fi Logo"
        width={isSmall ? "24" : "32"}
        height={isSmall ? "24" : "32"}
      />
      <span className={logoTextClassName}>Ko-fi XYZ</span>
    </div>
  );
}
