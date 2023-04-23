"use client";

import { useState } from "react";
import styles from "@/styles/ContactForm.module.css";

export default function EmailForm() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.SyntheticEvent) {
    console.log("Form is not functional yet.");
    //TODO: add email string validation and then show warning message next to input
  }

  return (
    <form onSubmit={handleSubmit} className={styles.contactFormContainer}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={message}
          className={styles.messageTextArea}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>
      <button className="primaryButton" type="submit">
        Send Email
      </button>
    </form>
  );
}
