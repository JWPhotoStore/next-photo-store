"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function MobileMenu() {
  const { isMobileMenuOpen } = useSelector(
    (state: RootState) => state.uiReducer
  );

  return (
    <>
      {isMobileMenuOpen && (
        <div
          style={{ height: "100vh", width: "100vw", backgroundColor: "beige" }}
        >
          MobileMenu
        </div>
      )}
    </>
  );
}
