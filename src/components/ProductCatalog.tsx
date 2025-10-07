import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ProductRating from "./ProductRating.tsx";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";

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
      ? "https://fakestoreapi.com/products" // fetch all products
      : `https://fakestoreapi.com/products/category/${encodeURIComponent(
          category
        )}`; // fetch products by category
  const response = await axios.get(URL);
  return response.data;
};

// Using `useQuery` to fetch GET, Handles caching, background refetch, retries for you.
// also, returns data, isLoading and error and receives props from App.tsx
const ProductCatalog: React.FC<productProps> = ({ selectedCategory }) => {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery<Product[]>({
    //A unique identifier for query, React Query uses this to know what data is being cached
    queryKey: ["products", selectedCategory],
    queryFn: () => fetchProducts(selectedCategory), //function to run fetchPosts.
  });

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products</p>;

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
                  />

                  <OverlayTrigger
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
                  >
                    <Card.Body tabIndex={0}>
                      <Card.Title className="ellipsis1">
                        {product.title}
                      </Card.Title>
                      <Card.Text className="ellipsis">
                        {product.description}
                      </Card.Text>
                    </Card.Body>
                  </OverlayTrigger>

                  <ListGroup className="list-group-flush">
                    <ListGroup.Item className="text-success fw-bold fs-5 text-center">
                      ${product.price}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <ProductRating
                        value={product.rating.rate}
                        count={product.rating.count}
                      />
                    </ListGroup.Item>
                  </ListGroup>

                  <Card.Body>
                    <Button
                      as="a"
                      variant="primary"
                      className="w-100"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/products/${product.id}`;
                      }}
                    >
                      Add To Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    </>
  );
};

export default ProductCatalog;
