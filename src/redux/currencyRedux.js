import { createSlice } from "@reduxjs/toolkit";

const currencySlice = createSlice({
  name: "currency",

  initialState: {
    value: "",
    symbol: "",
  },

  reducers: {
    addCurrency: (state, action) => {
      state.value = action.payload.value;
      state.symbol = action.payload.symbol;
    },
  },
});

export default currencySlice.reducer;
export const currencyActions = currencySlice.actions;
