//
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    totalAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      // console.log(state.productss
      const newItem = action.payload;

      const existingItem = state.products.find(
        (item) => item.id === newItem.id
      );
      if (!existingItem) {
        state.products.push(action.payload);
        state.quantity++;
      } else {
        existingItem.quantity = existingItem.quantity + action.payload.quantity;
      }
      state.totalAmount += action.payload.price * action.payload.quantity; //quantity of products being added, not cart quantity

      // console.log(state.products);
    },

    removeFromCart: (state, action) => {
      const { id } = action.payload;
      // console.log(id);
      const existingItem = state.products.find((item) => item.id === id);
      // console.log(existingItem);
      state.totalAmount -= existingItem.price;
      if (existingItem.quantity === 1) {
        state.products = state.products.filter((item) => item.id !== id);
        state.quantity--;
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
    adjustTotal: (state, action) => {
      console.log(action.payload.currency);
      // changing the price of cart items according to currencty change
      state.totalAmount = 0;

      for (let i = 0; i < state.products.length; i++) {
        state.products[i].price = state.products[i].prices.find(
          (item) => item.currency.label === action.payload.currency
        ).amount;

        console.log(
          state.products[i].price,
          state.products[i].prices.find(
            (item) => item.currency.label === action.payload.currency
          ).amount,
          state.products[i].quantity
        );

        state.totalAmount +=
          state.products[i].price * state.products[i].quantity;
      }
    },

    resetTotal: (state, action) => {
      state.totalAmount = 0;
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;

// localStorage.setItem("products", state.products);
//     localStorage.setItem("quantity", state.quantity);
//     localStorage.setItem("total", state.total);

// localStorage.removeItem("products");
// localStorage.removeItem("quantity");
// localStorage.removeItem("total");
// console.log(localStorage.getItem("products"));
