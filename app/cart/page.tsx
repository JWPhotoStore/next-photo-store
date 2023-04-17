"use client";

import React from "react";
import Providers from "@/app/components/Providers";
import CartContainer from "./CartContainer";

export default function Cart() {
  return (
    <Providers>
      <CartContainer />
    </Providers>
  );
}
