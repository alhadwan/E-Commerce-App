import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define the CartItem and CartState types
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}
// setting the Items to an array of CartItem
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

// initial cart state and tax rate
const initialState: CartState = {
  items: loadCartFromStorage(),
  taxRate: 0.08,
};

// Create the cart slice to use in the store
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add a product to the cart with quantity management and sessionStorage sync
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const p = action.payload;
      const existing = state.items.find((i) => i.id === p.id);
      if (existing) {
        existing.quantity += 1; // Increment quantity if item already in cart
      } else {
        state.items.push({ ...p, quantity: 1 });
      }
      // Sync to sessionStorage
      sessionStorage.setItem("productItem", JSON.stringify(state.items));
      console.log(p);
    },
    // Remove a product from the cart by ID and sync to sessionStorage
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // Sync to sessionStorage
      sessionStorage.setItem("productItem", JSON.stringify(state.items));
    },
    // Update the quantity of a specific cart item and sync to sessionStorage
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (!item) return;
      if (quantity <= 0) {
        // remove quantity if zero
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        item.quantity = quantity; //Sets exact quantity
      }
      // Sync to sessionStorage
      sessionStorage.setItem("productItem", JSON.stringify(state.items));
    },
    // Set a new tax rate for the cart
    setTaxRate: (state, action: PayloadAction<number>) => {
      state.taxRate = action.payload;
    },

    // clearing the Redux state and sessionStorage
    clearCart: (state) => {
      state.items = [];
      sessionStorage.removeItem("productItem");
    },
  },
});

// Export actions and reducer to be used in the store
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setTaxRate,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
