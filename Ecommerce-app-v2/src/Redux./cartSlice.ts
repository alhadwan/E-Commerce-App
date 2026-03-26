import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define the CartItem and CartState types
//dose this need to be the same as the product type in ProductList.tsx? //
interface CartItem {
  id: string; // Changed to string for Firestore compatibility
  title: string;
  price: number;
  image: string;
  quantity: number;
}

type AddToCartPayload = Omit<CartItem, "quantity">;

// setting the Items to an array of CartItem
interface CartState {
  items: CartItem[];
  taxRate: number;
}

// initial cart state and tax rate
const initialState: CartState = {
  // items: loadCartFromStorage(),
  items: [],
  taxRate: 0.08,
};

// Create the cart slice to use in the store
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    // Add a product to the cart with quantity management
    addToCart: (state, { payload }: PayloadAction<AddToCartPayload>) => {
      const item = state.items.find((i) => i.id === payload.id);
      if (item) item.quantity += 1;
      else state.items.push({ ...payload, quantity: 1 });
    },

    // Remove a product from the cart that matches the given ID by filtering it out of the items array
    // and assigning the filtered array back to state.items array
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // Update the quantity of a specific cart item 
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
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
    },
    // Set a new tax rate for the cart
    setTaxRate: (state, action: PayloadAction<number>) => {
      state.taxRate = action.payload;
    },

    // clearing the Redux state
    clearCart: (state) => {
      state.items = [];
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
