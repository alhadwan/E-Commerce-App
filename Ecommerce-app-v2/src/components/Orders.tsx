import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

// This component displays a list of past orders for the authenticated user.

interface orderItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  items: orderItem[];
  total: number;
  itemPrice: number;
  taxRate: number;
  userId: string;
  userEmail: string;
  userName: string;
  timestamp: any;
}

const Orders = () => {
  const [data, setData] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();

  // Load the latest order data from Firestore for the current user
  useEffect(() => {
    const fetchLatestOrder = async () => {
      // Wait for authentication to complete before checking user to prevent race conditions
      if (authLoading) {
        console.log("loading authentication...");
        return;
      }

      if (!user) {
        console.log("User not authenticated after auth loading completed");
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        // Query to get ALL orders for the current user, ordered by timestamp (newest first)
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );

        // Execute the query
        const querySnapshot = await getDocs(ordersQuery);
        if (!querySnapshot.empty) {
          const ordersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Order[];

          setData(ordersData);
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

  // Handle orders loading state
  if (loading) {
    return <div className="text-center mt-5">Loading your orders...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  }

  // Handle no orders
  if (data.length === 0) {
    return <div className="text-center mt-5">No orders found.</div>;
  }

  return (
    <div>
      <Row className="m-5">
        <Col md={12}>
          <div className="mb-4">
            <h3 className="mb-3">Total Orders ({data.length})</h3>
            {data.map((item) => (
              <div key={item.id} className="card mb-3 shadow-sm">
                Order Number: {item.orderNumber} - Total: $
                {item.total.toFixed(2)}{" "}
                {item.timestamp.toDate().toLocaleString()}
                {item.items.map((order) => (
                  <div key={order.id} className="card-body">
                    <Row className="align-items-center">
                      <Col md={3}>
                        <img
                          className="img-fluid rounded"
                          style={{
                            height: "80px",
                            width: "80px",
                            objectFit: "contain",
                          }}
                          src={order.image}
                          alt={order.title}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <h6 className="card-title mb-1 text-truncate">
                          {order.title}
                        </h6>
                        <p className="text-muted mb-1">
                          ${order.price.toFixed(2)} each
                        </p>
                        <span className="badge bg-secondary">
                          Qty: {order.quantity}
                        </span>
                      </Col>
                      <Col md={3} className="text-end">
                        <div className="fw-bold text-success fs-5">
                          ${(order.price * order.quantity).toFixed(2)}
                        </div>
                        <small className="text-muted">
                          {order.quantity} × ${order.price.toFixed(2)}
                        </small>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Orders;
