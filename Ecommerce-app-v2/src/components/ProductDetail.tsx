import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux./cartSlice";
import type { AppDispatch } from "../Redux./store";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import ProductRating from "./ProductRating";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import DeleteProduct from "./DeleteProduct";

// This component displays detailed information about a specific product and allows users to add it to their cart.

// Product type
type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

// Function to fetch a single product by ID

// const fetchProduct = async (id: string): Promise<Product> => {
//   const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
//   return response.data;
// };

const ProductDetail = () => {
  // Get the product ID from the URL parameters
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<Product>();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch product data from Firestore using the ID
    const fetchProductId = async (id: string) => {
      try {
        // fetching only the specific product
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = {
            id: docSnap.id,
            ...docSnap.data(),
          } as Product;
          setProduct(productData);
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) {
      fetchProductId(id);
    }
  }, [id]);

  // Fetch the specific product using the ID using React Query
  // const {
  //   data: product,
  //   isLoading,
  //   error,
  // } = useQuery<Product>({
  //   queryKey: ["product", id], // Unique key for the query to cache results
  //   queryFn: () => fetchProduct(id!), // Fetch function to get product details
  //   enabled: !!id, // Only run the query if ID is available
  // });

  // displaying loading and error states
  // if (isLoading) return <p>Loading product details...</p>;
  // if (error) return <p>Error loading product details</p>;
  // if (!product) return <p>Product not found</p>;

  // Handle adding product to cart
  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 1000);
  };

  // Show loading state while product is being fetched
  if (!product) {
    return (
      <div>
        <Button variant="primary" className="mt-3 ms-3" href="/">
          back
        </Button>
        <div className="text-center mt-5">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button variant="primary" className="mt-3 ms-3" href="/">
        back
      </Button>
      <Row className="p-5">
        <Col md={4}>
          <img
            className="img-fluid "
            style={{
              height: "380px",
              width: "100%",
              objectFit: "contain",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            src={product.image}
            alt={product.title}
          />
        </Col>
        <Col md={4} className="mt-4">
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <p className="text-success">Price: ${product.price}</p>
          <p>Category: {product.category}</p>
          <p>
            <ProductRating
              value={product.rating.rate}
              count={product.rating.count}
            />
          </p>
        </Col>
        <Col md={4}>
          <ListGroup className="list-group-flush text-center">
            <ListGroup.Item className="fw-bold fs-5">
              Item Price: ${product.price}
            </ListGroup.Item>

            <ListGroup.Item className="text-success fw-bold fs-5">
              Total: ${product.price.toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                variant="primary"
                className="w-100"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Link
                to={`/edit-product/${product.id}`}
                className="btn btn-warning w-100 mt-2"
              >
                Edit Product
              </Link>
              <DeleteProduct />
            </ListGroup.Item>
            {success && (
              <p className="text-success">Item added to cart successfully!</p>
            )}
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;
