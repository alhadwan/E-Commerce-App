import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  taxRate: number;
}

const initialState: CartState = {
  items: [],
  taxRate: 0.08, // 8% tax rate - you can adjust this value
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const p = action.payload;
      const existing = state.items.find((i) => i.id === p.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...p, quantity: 1 });
      }
      console.log(p);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id); // find item by id
      if (!item) return;
      if (quantity <= 0) {
        // is quantity is zero remove it
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        item.quantity = quantity; //set the quantity to the user's quantity
      }
    },
    setTaxRate: (state, action: PayloadAction<number>) => {
      state.taxRate = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setTaxRate } =
  cartSlice.actions;

export default cartSlice.reducer;
