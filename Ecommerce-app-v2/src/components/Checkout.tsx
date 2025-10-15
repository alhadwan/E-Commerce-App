import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../Redux./store.ts";
import { Row, Col, Button } from "react-bootstrap";
import { clearCart } from "../Redux./cartSlice.ts";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig.ts";
import { useAuth } from "../hooks/useAuth";

//This component displays the order summary during checkout and allows users to place their order.

const Checkout = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const taxRate = useSelector((state: RootState) => state.cart.taxRate);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current authenticated user

  const [success, setSuccess] = useState(false);

  // Calculate total price including tax
  const Total = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity * (1 + taxRate);
  }, 0);

  // Calculate item price before tax
  const itemPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Handle placing the order
  const handlePlaceOrder = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      // Generate order number before clearing cart
      const orderNumber = `#ORD-${Date.now()}`;

      // Prepare order data
      const orderData = {
        orderNumber,
        items: cartItems,
        total: Total,
        itemPrice,
        taxRate,
        userId: user.uid,
        userEmail: user.email,
        timestamp: serverTimestamp(),
      };

      // Save order to Firestore before clearing cart
      const docRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Order saved to Firestore with ID:", docRef.id);

      // Clear cart after saving order
      dispatch(clearCart());
      setSuccess(true);
      navigate("/placeOrder");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div>
      <Row className="m-5">
        <Col md={8}>
          <div className="mb-4">
            <h3 className="mb-3">Order Items ({cartItems.length})</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <Row className="align-items-center">
                    <Col md={3}>
                      <img
                        className="img-fluid rounded"
                        style={{
                          height: "80px",
                          width: "80px",
                          objectFit: "contain",
                        }}
                        src={item.image}
                        alt={item.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <h6 className="card-title mb-1 text-truncate">
                        {item.title}
                      </h6>
                      <p className="text-muted mb-1">
                        ${item.price.toFixed(2)} each
                      </p>
                      <span className="badge bg-secondary">
                        Qty: {item.quantity}
                      </span>
                    </Col>
                    <Col md={3} className="text-end">
                      <div className="fw-bold text-success fs-5">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <small className="text-muted">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </small>
                    </Col>
                  </Row>
                </div>
              </div>
            ))}
          </div>
        </Col>
        <Col md={4}>
          <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cartItems.length} items):</span>
                <span>${itemPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (8%):</span>
                <span>${(itemPrice * taxRate).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3 fw-bold fs-5">
                <span>Total:</span>
                <span className="text-success">${Total.toFixed(2)}</span>
              </div>
              <Button
                variant="success"
                size="lg"
                className="w-100"
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
              >
                <i className="fas fa-credit-card me-2"></i>
                Place Order
              </Button>
              {success && (
                <div className="alert alert-success mt-3 mb-0">
                  <i className="fas fa-check-circle me-2"></i>
                  Order placed successfully!
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
