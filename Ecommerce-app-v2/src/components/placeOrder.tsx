import { useState, useEffect } from "react";
import { Row, Col, ListGroup, Card } from "react-bootstrap";
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
  const { user } = useAuth();

  // Load the latest order data from Firestore for the current user
  useEffect(() => {
    const fetchLatestOrder = async () => {
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
  }, [user]);

  // Handle loading state
  if (loading) {
    return <div className="text-center mt-5">Loading order details...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  }

  // Handle no order data
  if (!orderData) {
    return <div className="text-center mt-5">No order data found.</div>;
  }

  // Format order date from Firestore timestamp
  let orderDate: Date;
  if (orderData.timestamp && orderData.timestamp.toDate) {
    orderDate = orderData.timestamp.toDate(); // Firestore timestamp
  } else {
    orderDate = new Date(); // Fallback to current date
  }

  const year = orderDate.getFullYear();
  const month = orderDate.getMonth();
  const day = orderDate.getDate();

  return (
    <div>
      <h1 className="text-center mt-3 mb-3">MY Orders</h1>
      <Card className="">
        <p>Order {orderData.orderNumber}</p>
        <p>{`Order Placed: ${day}/ ${month + 1}/ ${year}`}</p>
      </Card>
      <Card>
        {orderData.items.map((item: CartItem) => (
          <li key={item.id} className="list-unstyled mb-3">
            <Row className="ms-3">
              <Col md={6}>
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
              <Col md={6} className="fw-bold fs-5 mt-2">
                {item.title} -{" "}
                {item.quantity && `$${(item.price * item.quantity).toFixed(2)}`}{" "}
                X {item.quantity}
              </Col>
            </Row>
          </li>
        ))}
      </Card>

      <Card>
        <Col md={12}>
          <ListGroup className="list-group-flush text-center">
            {/* <ListGroup.Item className="fw-bold fs-5">
              Item Price: ${itemPrice.toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item className="fw-bold fs-5">
              Tax: ${(Total * taxRate).toFixed(2)} (8%)
            </ListGroup.Item> */}
            <ListGroup.Item className="text-success fw-bold fs-5 d-flex justify-content-end">
              Total: ${orderData.total.toFixed(2)} (Inc. tax)
            </ListGroup.Item>
            {/* <ListGroup.Item>
              <Button
                variant="primary"
                className="w-100"
                as={Link} to="/placeOrder"
              >
               place order
              </Button>
            </ListGroup.Item> */}
          </ListGroup>
        </Col>
      </Card>
    </div>
  );
};

export default PlaceOrder;
