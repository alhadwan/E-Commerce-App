import { useState, useEffect } from "react";
import { CardBody } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux./cartSlice";
import ProductRating from "./ProductRating.tsx";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { AppDispatch } from "../Redux./store.ts";
import { db } from "../firebaseConfig.ts";
import { collection, getDocs } from "firebase/firestore";

// This component displays a catalog of products based on the selected category and allows users to add products to their cart.

// Interface for ProductCatalog component props
interface productProps {
  selectedCategory: string;
}

// Interface for Product type
type Product = {
  id?: string;
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

// Using `useQuery` to fetch GET, Handles caching, background refetch, retries for you.
// also, returns data, isLoading and error and receives props from App.tsx
const ProductCatalog: React.FC<productProps> = ({ selectedCategory }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        // Filter products by category if not "all"
        const filteredProducts =
          selectedCategory === "all"
            ? products
            : products.filter(
                (product) => product.category === selectedCategory
              );

        setData(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, [selectedCategory]); // Re-fetch when category changes

  // Handle adding product to cart
  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        id: product.id as string, // Use string ID from Firestore
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
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-primary w-100 text-decoration-none"
                    >
                      View Details
                    </Link>
                    <Button
                      variant="warning"
                      className="w-100 mt-2"
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
