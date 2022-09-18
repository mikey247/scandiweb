import { createSlice } from "@reduxjs/toolkit";

const currencySlice = createSlice({
  name: "currency",

  initialState: {
    value: localStorage.getItem("currency"),
  },

  reducers: {
    addCurrency: (state, action) => {
      state.value = action.payload.value;
      localStorage.setItem("currency", action.payload.value);
    },
  },
});

export default currencySlice.reducer;
export const currencyActions = currencySlice.actions;
