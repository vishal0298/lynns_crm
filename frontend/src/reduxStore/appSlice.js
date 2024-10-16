import { createSlice } from "@reduxjs/toolkit";
import { redirectToLogin } from "./stateStorage";

const initialState = {
  userDetails: {},
  invoiceLogo: "",
  invoiceTemplate: "1",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUserDetails: (state, { payload }) => {
      state.userDetails = payload;
    },
    setInvoiceLogo: (state, { payload }) => {
      state.invoiceLogo = payload;
    },
    setInvoiceTemplate: (state, { payload }) => {
      state.invoiceTemplate = payload;
    },
    logOut: (state) => {
      state.userDetails = {};
      redirectToLogin();
    },
  },
});

export const { setUserDetails, logOut, setInvoiceLogo, setInvoiceTemplate } =
  appSlice.actions;
export default appSlice.reducer;
