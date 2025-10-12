import "./App.css";
import ProductCatalog from "./components/ProductCatalog";
import AddToCart from "./components/AddToCart";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ProductDetail from "./components/ProductDetail";
import Checkout from "./components/Checkout";
import PlaceOrder from "./components/placeOrder";
import Login from "./components/Login";
import Registration from "./components/Registration";
import { useAuth } from "./hooks/useAuth";

function App() {
  const [category, setCategory] = useState("all");
  const { user, loading } = useAuth();
  // Show loading spinner while checking auth
  if (loading) {
    return <div className="d-flex justify-content-center mt-5">Loading...</div>;
  }

  // Show login/register pages if user is not authenticated
  if (!user) {
    return (
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="*" element={<Login />} />{" "}
        {/* Default to login for any route */}
      </Routes>
    );
  }

  // Show main app if user is authenticated
  return (
    <>
      <Navbar category={category} onChange={setCategory} />
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route
          path="/"
          element={<ProductCatalog selectedCategory={category} />}
        />
        <Route path="/cart" element={<AddToCart />} />
        <Route path="/placeOrder" element={<PlaceOrder />} />
      </Routes>
    </>
  );
}

export default App;
