import "./App.css";
import ProductCatalog from "./components/ProductCatalog";
import AddToCart from "./components/AddToCart";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [category, setCategory] = useState("all")
  return (
    <>
      <Navbar category={category} onChange={setCategory}/>
      <Routes>
        <Route path="/" element={<ProductCatalog selectedCategory={category}/>} />
        <Route path="/products/:id" element={<AddToCart />} />
      </Routes>
    </>
  );
}

export default App;
