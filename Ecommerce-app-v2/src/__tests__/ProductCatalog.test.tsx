import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";
import ProductCatalog from "../components/ProductCatalog";
import cartSlice from "../Redux./cartSlice";

// Create a mock store for testing
const createMockStore = () => {
  return configureStore({
    reducer: {
      cart: cartSlice,
    },
  });
};

// Mock Firebase
jest.mock("../firebaseConfig", () => ({
  db: {},
}));

// Mock Firestore functions
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(() =>
    Promise.resolve({
      docs: [
        {
          id: "1",
          data: () => ({
            title: "Test Product",
            description: "Test Description",
            price: 29.99,
            category: "electronics",
            image: "test-image.jpg",
            rating: { rate: 4.5, count: 100 },
          }),
        },
      ],
    })
  ),
}));

describe("ProductCatalog Component", () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
  });

  it("renders product catalog with products", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalog selectedCategory="all" />
        </BrowserRouter>
      </Provider>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("adds product to cart when Add to Cart button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalog selectedCategory="all" />
        </BrowserRouter>
      </Provider>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    // Find and click the Add to Cart button
    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    await user.click(addToCartButton);

    // Verify the product was added to the store
    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].title).toBe("Test Product");
  });

  it("navigates to product detail when View Details is clicked", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalog selectedCategory="all" />
        </BrowserRouter>
      </Provider>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    // Find the View Details link
    const viewDetailsLink = screen.getByRole("link", { name: /view details/i });
    expect(viewDetailsLink).toHaveAttribute("href", "/product/1");
  });
});
