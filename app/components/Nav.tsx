"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import styles from "@/styles/Nav.module.css";

export default function Nav({ user }: Session) {
  return (
    <nav className={styles.nav}>
      <h1>Styled</h1>
      <ul>
        {/* If the user is not signed in */}
        {!user && (
          <li className={styles.signIn}>
            <button className={styles.button} onClick={() => signIn()}>
              Sign in
            </button>
          </li>
        )}
        {user && (
          <>
            <li>
              <Image
                src={user?.image as string}
                alt={user.name as string}
                width={48}
                height={48}
                className={styles.image}
              />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
