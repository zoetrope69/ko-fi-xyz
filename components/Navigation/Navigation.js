import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

import Button from "../Button/Button";

import styles from "./Navigation.module.css";

export default function Navigation({ user, isLoading }) {
  return (
    <nav className={styles.Nav}>
      <div className={styles.NavTitle}>
        <Image
          className={styles.NavTitleLogo}
          src="/ko-fi-logo.png"
          alt="Ko-fi Logo"
          width="30"
          height="30"
        />{" "}
        <h1 className={styles.NavTitleText}>Ko-fi Custom Alerts</h1>
      </div>

      {!isLoading && (
        <div className={styles.NavUserInfo}>
          {user && <p>{user.email}</p>}

          <Link href="/logout" passHref>
            <Button isSmall isSecondary>
              Logout
            </Button>
          </Link>
        </div>
      )}

      <ul className={styles.NavList}>
        <li className={styles.NavListItem}>
          <Link href="/getting-started">Getting Started</Link>
        </li>
        <li className={styles.NavListItem}>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className={styles.NavListItem}>
          <Link href="/settings">Settings</Link>
        </li>
      </ul>

      <div className={styles.NavSupportContainer}>
        <a
          className={classNames(
            styles.NavSupport,
            styles["NavSupport--discord"]
          )}
          href="https://discord.gg/D4T25jyCRU"
        >
          <Image
            className={styles.NavSupportIcon}
            src="/discord-logo.png"
            alt=""
            width="30"
            height="30"
          />
          Need help? Feedback?
          <br /> Let Zac know on Discord
        </a>

        <a
          className={classNames(
            styles.NavSupport,
            styles["NavSupport--ko-fi"]
          )}
          href="https://ko-fi.com/zactopus"
        >
          <Image
            className={styles.NavSupportIcon}
            src="/ko-fi-logo-cup.png"
            alt=""
            width="30"
            height="30"
          />
          Support zactopus on Ko-fi
        </a>
      </div>
    </nav>
  );
}
