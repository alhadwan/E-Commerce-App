import { Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../Redux./store.ts";
import { removeFromCart, updateQuantity } from "../Redux./cartSlice.ts";
import { Link } from "react-router-dom";

// This component displays the items in the cart and allows users to proceed to checkout,
// Also update item quantities, or remove items from the cart.

const AddToCart = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  // Calculate total number of items in the cart
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calculate item price before tax
  const itemPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Empty cart state
  if (cartItemCount === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="mb-4">
            <i className="fas fa-shopping-cart fa-5x text-muted mb-3"></i>
            <h3 className="text-muted">Your cart is empty</h3>
            <p className="text-muted">
              Looks like you haven't added any items to your cart yet.
            </p>
          </div>
          <Link to="/" className="btn btn-primary btn-lg">
            <i className="fas fa-arrow-left me-2"></i>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Row>
        <Col md={8}>
          <div className="mb-4">
            <h3 className="mb-3">
              <i className="fas fa-shopping-cart me-2"></i>
              Shopping Cart ({cartItemCount} items)
            </h3>
            {cartItems.map((item) => (
              <div key={item.id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <Row className="align-items-center">
                    <Col md={3}>
                      <img
                        className="img-fluid rounded"
                        style={{
                          height: "100px",
                          width: "100px",
                          objectFit: "contain",
                        }}
                        src={item.image}
                        alt={item.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://via.placeholder.com/100x100?text=No+Image";
                        }}
                      />
                    </Col>
                    <Col md={5}>
                      <h6 className="card-title mb-1 text-truncate">
                        {item.title}
                      </h6>
                      <p className="text-muted mb-2">
                        ${item.price.toFixed(2)} each
                      </p>
                      <div className="fw-bold text-success fs-5">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <small className="text-muted">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </small>
                    </Col>
                    <Col md={4}>
                      <div className="d-flex flex-column gap-2">
                        {/* Quantity Controls */}
                        <div className="d-flex align-items-center justify-content-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  quantity: Math.max(1, item.quantity - 1),
                                })
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <i className="fas fa-minus"></i>
                          </Button>
                          <span className="mx-3 fw-bold fs-5">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  quantity: item.quantity + 1,
                                })
                              )
                            }
                          >
                            <i className="fas fa-plus"></i>
                          </Button>
                        </div>
                        {/* Remove Button */}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="w-100"
                        >
                          <i className="fas fa-trash me-2"></i>
                          Remove
                        </Button>
                      </div>
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
              <h5 className="mb-0">
                <i className="fas fa-calculator me-2"></i>
                Cart Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cartItemCount} items):</span>
                <span>${itemPrice.toFixed(2)}</span>
              </div>
              <hr />
              <Link
                to="/checkout"
                className="btn btn-success btn-lg w-100 text-decoration-none"
              >
                <i className="fas fa-credit-card me-2"></i>
                Proceed to Checkout
              </Link>
              <Link
                to="/"
                className="btn btn-outline-primary w-100 mt-2 text-decoration-none"
              >
                <i className="fas fa-arrow-left me-2"></i>
                Continue Shopping
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AddToCart;
