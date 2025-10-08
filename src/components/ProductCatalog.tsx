import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CardBody } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Redux./cartSlice";
import ProductRating from "./ProductRating.tsx";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../Redux./store.ts";

//This component fetches and displays a list of products based on the selected category.

// Interface for ProductCatalog component props
interface productProps {
  selectedCategory: string;
}

// Interface for Product type
type Product = {
  id: number;
  title: string;
  description: string;
  rate: number;
  price: number;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

// Function to fetch products based on selected category
const fetchProducts = async (category: string): Promise<Product[]> => {
  const URL =
    category === "all"
      ? "https://fakestoreapi.com/products"
      : `https://fakestoreapi.com/products/category/${encodeURIComponent(
          category
        )}`;
  const response = await axios.get(URL);
  return response.data;
};

// Using `useQuery` to fetch GET, Handles caching, background refetch, retries for you.
// also, returns data, isLoading and error and receives props from App.tsx
const ProductCatalog: React.FC<productProps> = ({ selectedCategory }) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data = [], // default to empty array to avoid undefined errors
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products", selectedCategory], // Unique key for the query to cache results
    queryFn: () => fetchProducts(selectedCategory), //function to run fetchPosts using the selected category
  });

  // displaying loading and error states
  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products</p>;

  // Handle adding product to cart
  const handleAddToCart = (product: Product) => {
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
    <>
      <Container className="mt-3">
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {data &&
            data.map((product) => (
              <Col key={product.id}>
                <Card
                  className="h-100 rounded-4 "
                  style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
                >
                  <Card.Img
                    src={product.image}
                    alt={product.title}
                    style={{
                      height: 180,
                      objectFit: "contain",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />

                  {/* <OverlayTrigger
                  trigger={["hover", "focus"]}
                  placement="top"
                  delay={{ show: 150, hide: 100 }}
                  containerPadding={8}
                  overlay={
                    <Tooltip id={`desc-tip-${product.id}`}>
                      <div className="fw-semibold mb-1">{product.title}</div>
                      <div style={{ whiteSpace: "normal", maxWidth: 320 }}>
                        {product.description}
                      </div>
                    </Tooltip>
                  }
                  ></OverlayTrigger> */}
                  <Card.Body tabIndex={0}>
                    <Card.Title className="ellipsis1">
                      {product.title}
                    </Card.Title>
                    <Card.Text className="ellipsis">
                      {product.description}
                    </Card.Text>
                  </Card.Body>

                  <ListGroup className="list-group-flush">
                    <ListGroup.Item className="text-success fw-bold fs-5 text-center">
                      ${product.price}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <ProductRating
                        value={product.rating.rate}
                        count={`${product.rating.count} reviews`}
                      />
                    </ListGroup.Item>
                  </ListGroup>
                  <CardBody>
                    <Button
                      variant="primary"
                      className="w-100"
                      as={Link}
                      to={`/product/${product.id}`}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="primary"
                      className="w-100 mt-3 bg-warning"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    </>
  );
};

export default ProductCatalog;
