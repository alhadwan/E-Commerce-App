import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Redux./cartSlice";
import type { AppDispatch, RootState } from "../Redux./store";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import ProductRating from "./ProductRating";
import { Button } from "react-bootstrap";

// Product type
type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

// Function to fetch a single product by ID
const fetchProduct = async (id: string): Promise<Product> => {
  const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
  return response.data;
};

const ProductDetail = () => {
  // Get the product ID from the URL parameters
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  // Get taxRate from Redux store
  const taxRate = useSelector((state: RootState) => state.cart.taxRate);

  // Fetch the specific product using the ID
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: ["product", id], // Unique query key for the product
    queryFn: () => fetchProduct(id!), // Non-null assertion since ID is required
    enabled: !!id, // Only run query if ID exists
  });

  if (isLoading) return <p>Loading product details...</p>;
  if (error) return <p>Error loading product details</p>;
  if (!product) return <p>Product not found</p>;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
  };
  return (
    <div>
      <Button variant="primary" className="mt-3 ms-3" href="/">
        back
      </Button>
      <Row className="p-5">
        <Col md={4}>
          <img
            className="img-fluid "
            style={{
              height: "380px",
              width: "100%",
              objectFit: "contain",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            src={product.image}
            alt={product.title}
          />
        </Col>
        <Col md={4} className="mt-4">
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <p>Category: {product.category}</p>
          <p>
            <ProductRating
              value={product.rating.rate}
              count={product.rating.count}
            />
          </p>
        </Col>
        <Col md={4}>
          <ListGroup className="list-group-flush text-center">
            <ListGroup.Item className="fw-bold fs-5">
              Item Price: ${product.price}
            </ListGroup.Item>
            {/* <ListGroup.Item className="fw-bold fs-5">
              Tax: ${(product.price * taxRate).toFixed(2)} (8%)
            </ListGroup.Item> */}
            <ListGroup.Item className="text-success fw-bold fs-5">
              Total: ${product.price.toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                variant="primary"
                className="w-100"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;
