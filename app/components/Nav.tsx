"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import styles from "@/styles/Nav.module.css";
import Link from "next/link";

export default function Nav({ user }: Session) {
  return (
    <nav className={styles.nav}>
      <Link href="/">
        <h1>Styled</h1>
      </Link>
      <ul>
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
                //TODO: Add a default image if the user doesn't have one
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
