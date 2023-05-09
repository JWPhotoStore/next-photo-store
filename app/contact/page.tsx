"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/styles/ContactForm.module.css";
import emailjs from "@emailjs/browser";

export default function EmailForm() {
  const form = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [formSending, setFormSending] = useState(false);
  const [isVarMissing, setIsVarMissing] = useState(true);

  const clearForm = () => {
    setName("");
    setPhoneNumber("");
    setEmail("");
    setTitle("");
    setMessage("");
  };

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY &&
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID &&
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    )
      setIsVarMissing(false);
  }, []);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setFormSending(true);
    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        form.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
      )
      .then(
        (result) => {
          console.log(result.text);
          clearForm();
          setFormSending(false);
        },
        (error) => {
          console.log(error.text);
          setFormSending(false);
        }
      );
    //TODO: add email string validation and then show warning message next to input
  }

  return (
    <form
      ref={form}
      onSubmit={handleSubmit}
      className={styles.contactFormContainer}
    >
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phone_number"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={message}
          className={styles.messageTextArea}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>
      <button
        className="primaryButton"
        type="submit"
        disabled={isVarMissing || formSending}
      >
        Send Email
      </button>
    </form>
  );
}
