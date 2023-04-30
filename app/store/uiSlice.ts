import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  isMobileMenuOpen: boolean;
}

const initialState: UIState = {
  isMobileMenuOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleMobileMenu } = uiSlice.actions;

export default uiSlice.reducer;
