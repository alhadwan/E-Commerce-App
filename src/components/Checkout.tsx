import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../Redux./store.ts";
import { Row, Col, ListGroup, Button } from "react-bootstrap";
import { clearCart } from "../Redux./cartSlice.ts";
import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const taxRate = useSelector((state: RootState) => state.cart.taxRate);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const Total = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity * (1 + taxRate);
  }, 0);
  const itemPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handlePlaceOrder = () => {
    // Generate order number before clearing cart
    const orderNumber = `#ORD-${Date.now()}`;

    // Save order data to sessionStorage before clearing cart
    const orderData = {
      orderNumber,
      items: cartItems,
      total: Total,
      date: new Date().toISOString(),
      taxRate,
    };

    sessionStorage.setItem("lastOrder", JSON.stringify(orderData));

    // Clear cart after saving order
    dispatch(clearCart());

    // Navigate to order confirmation
    navigate("/placeOrder");
  };

  return (
    <div>
      <h1 className="text-center mt-3 mb-3">Order Summary</h1>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id} className="list-unstyled mb-3">
            <Row>
              <Col md={3}>
                <img
                  className="img-fluid "
                  style={{
                    height: "100px",
                    width: "100px",
                    objectFit: "contain",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                  src={item.image}
                  alt={item.title}
                />
              </Col>
              <Col md={3} className="fw-bold fs-5 mt-2">
                {item.title} -{" "}
                {item.quantity && `$${(item.price * item.quantity).toFixed(2)}`}{" "}
                X {item.quantity}
              </Col>
            </Row>
          </li>
        ))}
      </ul>
      <Row>
        <Col md={12}>
          <ListGroup className="list-group-flush text-center">
            <ListGroup.Item className="fw-bold fs-5">
              Item Price: ${itemPrice.toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item className="fw-bold fs-5">
              Tax: ${(Total * taxRate).toFixed(2)} (8%)
            </ListGroup.Item>
            <ListGroup.Item className="text-success fw-bold fs-5">
              Total: ${Total.toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                variant="primary"
                className="w-100"
                onClick={handlePlaceOrder}
              >
                place order
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
