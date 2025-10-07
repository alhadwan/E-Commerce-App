import "./App.css";
import ProductCatalog from "./components/ProductCatalog";
import AddToCart from "./components/AddToCart";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ProductDetail from "./components/ProductDetail";

function App() {
  const [category, setCategory] = useState("all");
  return (
    <>
      <Navbar category={category} onChange={setCategory} />
      <Routes>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route
          path="/"
          element={<ProductCatalog selectedCategory={category} />}
        />
        <Route path="/cart" element={<AddToCart />} />
      </Routes>
    </>
  );
}

export default App;
