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

//This component displays the navigation bar with category selection and cart item count

// Interface for Navbar component props
interface NavbarProps {
  category: string;
  onChange: (category: string) => void;
}

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
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-dark shadow-sm border-bottom border-secondary">
        <div className="container">
          {/* Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <span className="fw-bold">EZCommerce</span>
          </Link>
          <div className=" d-flex align-items-center gap-3">
            <div className="">
              <select
                id="category-select"
                className="form-select form-select-sm w-auto"
                value={category}
                onChange={(e) => onChange(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="">
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

            {/* Toggler */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>

          {/* Offcanvas / Main menu */}
          <div
            className="offcanvas offcanvas-end"
            tabIndex={-1}
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header bg-dark">
              <button
                type="button"
                className="btn-close bg-light"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>

            <div className="offcanvas-body margin-3 bg-dark d-flex flex-column align-items gap-4">
              <Link to="/profile" className="btn btn-outline-light w-auto">
                Profile
              </Link>
              <Link to="/orders" className="btn btn-outline-light">
                Orders
              </Link>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Logout
              </Button>

              <Link
                to="/add-product"
                className="btn btn-outline-light btn-hover-white"
              >
                Add Product
              </Link>
              <Link to="/delete-account" className="btn btn-outline-danger">
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
