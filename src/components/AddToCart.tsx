import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../Redux./store.ts";
import { removeFromCart, updateQuantity } from "../Redux./cartSlice.ts";
import { Link } from "react-router-dom";

// This component displays the items in the cart and allows users to proceed to checkout,
// update item quantities, or remove items from the cart.
const AddToCart = () => {
  const productItem = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  // Calculate total number of items in the cart
  const cartItemCount = productItem.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div>
      {cartItemCount == 0 ? (
        <p>
          Your cart is empty. Go to <a href="/">Products</a> to add items!
        </p>
      ) : (
        <Button
          className="btn btn-primary mb-3 mt-3 ms-3"
          as={Link}
          to="/checkout"
        >
          Proceed to checkout ({cartItemCount} items)
        </Button>
      )}

      <ul style={{ listStyleType: "none", padding: 5 }}>
        {productItem.map((item) => (
          <li key={item.id}>
            <Row className="ms-3 mb-3">
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
              <Col md={3} className="mt-3">
                <Button
                  variant="danger"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </Button>
              </Col>
              <Col md={3}>
                <Button
                  variant="secondary"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                >
                  -
                </Button>
                <span className="mx-2">{item.quantity}</span>
                <Button
                  variant="secondary"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                >
                  +
                </Button>
              </Col>
            </Row>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddToCart;
