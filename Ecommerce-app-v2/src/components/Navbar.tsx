import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import type { RootState } from "../Redux./store";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import Button from "react-bootstrap/esm/Button";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import DeleteAccount from "./DeleteAccount";

//This component displays the navigation bar with category selection and cart item count

// Interface for Navbar component props
interface NavbarProps {
  category: string;
  onChange: (category: string) => void;
}

// Function to fetch product categories from the API
// const fetchCategories = async () => {
//   const response = await axios.get(
//     `https://fakestoreapi.com/products/categories`
//   );
//   return response.data;
// };

// Navbar component which receives props from app.tsx and fetches categories
const Navbar: React.FC<NavbarProps> = ({ category, onChange }) => {
  // Get cart items count from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const [success, setSuccess] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoryNames = querySnapshot.docs.map((doc) => doc.data().name);
        setCategories(categoryNames);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
    setInterval(() => {
      setSuccess(false);
    }, 3000);
    setSuccess(true);
  };

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
            <div className="nav-item ms-3">
              <Button
                onClick={handleLogout}
                className="bg-dark text-white border-1 border-white hover:bg-white hover:text-black"
              >
                Logout
              </Button>
            </div>
            <div className="nav-item ms-3">
              <Link
                to="/profile"
                className="btn btn-outline-light btn-hover-white"
              >
                Profile
              </Link>
            </div>
            <div className="nav-item ms-3">
              <Link
                to="/orders"
                className="btn btn-outline-light btn-hover-white"
              >
                Orders
              </Link>
            </div>
            <div className="nav-item ms-3">
              <Link
                to="/delete-account"
                className="btn btn-outline-danger btn-hover-white"
              >
                Delete Account
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {success && <p className="text-success">Logout successfully</p>}
    </>
  );
};

export default Navbar;
