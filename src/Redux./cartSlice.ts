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

// Load cart from sessionStorage if available
const loadCartFromStorage = (): CartItem[] => {
  try {
    const storedCart = sessionStorage.getItem("productItem");
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
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
      // Sync to sessionStorage
      sessionStorage.setItem("productItem", JSON.stringify(state.items));
      console.log(p);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // Sync to sessionStorage
      sessionStorage.setItem("productItem", JSON.stringify(state.items));
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
      // Sync to sessionStorage
      sessionStorage.setItem("productItem", JSON.stringify(state.items));
    },
    setTaxRate: (state, action: PayloadAction<number>) => {
      state.taxRate = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      sessionStorage.removeItem("productItem");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setTaxRate,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
