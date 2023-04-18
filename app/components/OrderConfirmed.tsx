"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import stewie from "@/public/stewie.gif";

export default function OrderConfirmed() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div>
        <h1>Your order has been placed!</h1>
        <h2>Check your email for the receipt</h2>
        <Image src={stewie} alt="stewie" />
        <div>
          <Link href={"/dashboard"}>
            <button>Check your Order</button>
          </Link>
          <button onClick={() => {}}>Create a new Order</button>
        </div>
      </div>
    </motion.div>
  );
}
