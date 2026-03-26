import "./App.css";
import ProductCatalog from "./components/Pages/ProductCatalog";
import AddToCart from "./components/Pages/AddToCart";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ProductDetail from "./components/Pages/ProductDetail";
import Checkout from "./components/Pages/Checkout";
import PlaceOrder from "./components/Pages/placeOrder";
import Login from "./components/Pages/Login";
import Registration from "./components/Pages/Registration";
import Profile from "./components/Pages/profile";
import Orders from "./components/Pages/Orders";
import DeleteAccount from "./components/DeleteAccount";
import AddProduct from "./components/Pages/AddProduct";
import EditProduct from "./components/EditProduct";
import DeleteProduct from "./components/DeleteProduct";
import PrivateRoute from "./Routes/PrivateRoutes/PrivateRoute";
import PublicRoute from "./Routes/PublicRoutes/PublicRoute";
// import seedProduct from "./seeder/seedProduct";
// import seedCategories from "./seeder/seedCategoies";

function App() {
  const [category, setCategory] = useState("all");
  return (
    <>
      <Navbar category={category} onChange={setCategory} />
      <Routes>
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Registration />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
      </Routes>
      <Routes>
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PublicRoute>
              <ProductDetail />
            </PublicRoute>
          }
        />
        <Route
          path="*"
          element={
            <PublicRoute>
              <ProductCatalog selectedCategory={category} />
            </PublicRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PublicRoute>
              <AddToCart />
            </PublicRoute>
          }
        />
        <Route
          path="/placeOrder"
          element={
            <PrivateRoute>
              <PlaceOrder />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/delete-account"
          element={
            <PrivateRoute>
              <DeleteAccount />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-product/:id"
          element={
            <PrivateRoute>
              <EditProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/delete-product/:id"
          element={
            <PrivateRoute>
              <DeleteProduct />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
