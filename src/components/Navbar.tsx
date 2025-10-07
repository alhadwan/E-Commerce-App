import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Interface for Navbar component props
interface NavbarProps {
  category: string;
  onChange: (category: string) => void;
}

// fetch user data
const fetchCategories = async () => {
  const response = await axios.get(
    `https://fakestoreapi.com/products/categories`
  );
  return response.data;
};

// Navbar component which receives props from app.tsx and fetches categories
const Navbar: React.FC<NavbarProps> = ({ category, onChange }) => {
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
    return <p>Error fetching categories: {(categoriesError as Error)?.message}</p>;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <div className="container">
          <span className="navbar-brand text-white">E-Commerce Store</span>
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
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
