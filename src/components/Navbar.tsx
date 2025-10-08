import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import type { RootState } from "../Redux./store";

//This component displays the navigation bar with category selection and cart item count

// Interface for Navbar component props
interface NavbarProps {
  category: string;
  onChange: (category: string) => void;
}

// Function to fetch product categories from the API
const fetchCategories = async () => {
  const response = await axios.get(
    `https://fakestoreapi.com/products/categories`
  );
  return response.data;
};

// Navbar component which receives props from app.tsx and fetches categories
const Navbar: React.FC<NavbarProps> = ({
  category,
  onChange,
}: {
  category: string;
  onChange: (category: string) => void;
}) => {
  // Get cart items count from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  // fetch categories data
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  // loading categories state
  if (isCategoriesLoading) return <p>Loading Categories...</p>;
  // handle error states
  if (isCategoriesError)
    return (
      <p>Error fetching categories: {(categoriesError as Error)?.message}</p>
    );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <div className="container">
          <span className="navbar-brand text-white">
            <Link className="text-white text-decoration-none" to="/">
              E-Commerce Store
            </Link>
          </span>
          <div className="navbar-nav">
            <div className="nav-item">
              <select
                id="category-select"
                className="form-select"
                style={{ width: "200px" }}
                value={category}
                onChange={(e) => onChange(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="nav-item ms-3">
              <Link
                to="/cart"
                className="btn btn-outline-light position-relative"
                aria-label="View Cart"
              >
                <FaShoppingCart size={20} />
                <span className="ms-2">Cart</span>
                {cartItemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemCount}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
