import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { db } from "../firebaseConfig";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

// This component displays the order confirmation page after placing an order.
// It uses sessionStorage to retrieve the last order details and shows them to the user.
// since the cart is cleared after order placement.

// Types for cart items and order data
interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface OrderData {
  id?: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  itemPrice: number;
  taxRate: number;
  userId: string;
  userEmail: string;
  userName: string;
  timestamp: any;
}

const PlaceOrder = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  // Load the latest order data from Firestore for the current user
  useEffect(() => {
    const fetchLatestOrder = async () => {
      // Wait for authentication to complete before checking user to prevent race conditions
      if (authLoading) {
        return;
      }

      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        // Query to get the latest order for the current user
        // Using the composite index: userId (ASC) + timestamp (DESC)
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc"),
          limit(1)
        );

        const querySnapshot = await getDocs(ordersQuery);

        // Check if we got any results and extract the order data from the first document(orderby+limit)
        if (!querySnapshot.empty) {
          const latestOrderDoc = querySnapshot.docs[0];
          const orderData = {
            id: latestOrderDoc.id,
            ...latestOrderDoc.data(),
          } as OrderData;

          setOrderData(orderData);
        } else {
          setError("No orders found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchLatestOrder();
  }, [user, authLoading]);

  // Handle authentication loading state
  if (authLoading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Handle order data loading state
  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <strong>Error:</strong> {error}
          </div>
          <Link to="/" className="btn btn-primary">
            <i className="fas fa-home me-2"></i>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Handle no order data
  if (!orderData) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="alert alert-warning" role="alert">
            <i className="fas fa-info-circle me-2"></i>
            No order data found.
          </div>
          <Link to="/" className="btn btn-primary">
            <i className="fas fa-home me-2"></i>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Format order date from Firestore timestamp
  let orderDate: Date;
  if (orderData.timestamp && orderData.timestamp.toDate) {
    orderDate = orderData.timestamp.toDate();
  } else {
    orderDate = new Date(); // Fallback to current date
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mt-4">
      {/* Success Header */}
      <div className="text-center mb-4">
        <div className="mb-3">
          <i className="fas fa-check-circle text-success fa-4x"></i>
        </div>
        <h2 className="text-success mb-2">Order Confirmed!</h2>
        <p className="text-muted">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
      </div>

      <Row>
        <Col md={8}>
          {/* Order Details Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-receipt me-2"></i>
                Order Details
              </h5>
            </div>
            <div className="card-body">
              <Row>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Order Number:</strong>{" "}
                    <span className="text-primary">
                      {orderData.orderNumber}
                    </span>
                  </p>
                  <p className="mb-2">
                    <strong>Order Date:</strong> {formatDate(orderDate)}
                  </p>
                  <p className="mb-0">
                    <strong>Order Time:</strong> {formatTime(orderDate)}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Customer:</strong> {orderData.userEmail}
                  </p>
                  <p className="mb-2">
                    <strong>Items:</strong> {orderData.items.length} items
                  </p>
                  <p className="mb-0">
                    <strong>Status:</strong>{" "}
                    <span className="badge bg-success">Confirmed</span>
                  </p>
                </Col>
              </Row>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <h5 className="mb-3">
              <i className="fas fa-box me-2"></i>
              Order Items ({orderData.items.length})
            </h5>
            {orderData.items.map((item: CartItem) => (
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
          {/* Order Summary */}
          <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-calculator me-2"></i>
                Order Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${orderData.itemPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax ({(orderData.taxRate * 100).toFixed(0)}%):</span>
                <span>
                  ${(orderData.itemPrice * orderData.taxRate).toFixed(2)}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3 fw-bold fs-5">
                <span>Total Paid:</span>
                <span className="text-success">
                  ${orderData.total.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <Link to="/orders" className="btn btn-primary">
                  <i className="fas fa-history me-2"></i>
                  View All Orders
                </Link>
                <Link to="/" className="btn btn-outline-primary">
                  <i className="fas fa-shopping-bag me-2"></i>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrder;
