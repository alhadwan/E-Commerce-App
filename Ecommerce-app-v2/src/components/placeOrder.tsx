import { useState, useEffect } from "react";
import { Row, Col, ListGroup, Card } from "react-bootstrap";

// This component displays the order confirmation page after placing an order.
// It uses sessionStorage to retrieve the last order details and shows them to the user.
// since the cart is cleared after order placement.

// Types for cart items and order data
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface OrderData {
  orderNumber: string;
  items: CartItem[];
  total: number;
  date: string;
  taxRate: number;
}

const PlaceOrder = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  // Load order data from sessionStorage
  useEffect(() => {
    const savedOrder = sessionStorage.getItem("lastOrder");

    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    }
  }, []);

  // If no order data, show loading or redirect
  if (!orderData) {
    return <div>Loading order details...</div>;
  }

  // Format order date
  const orderDate = new Date(orderData.date);
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
