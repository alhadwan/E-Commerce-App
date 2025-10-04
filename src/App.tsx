import "./App.css";
import ProductCatalog from "./components/ProductCatalog";
import AddToCart from "./components/AddToCart";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/products/:id" element={<AddToCart />} />
      </Routes>
    </>
  );
}

export default App;
