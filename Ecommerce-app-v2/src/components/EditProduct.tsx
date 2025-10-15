import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

// this component allows users to edit an existing product

interface FormState {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    title: "",
    price: 0,
    description: "",
    category: "",
    image: "",
    rating: {
      rate: 0,
      count: 0,
    },
  });

  // Load existing product data when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is required");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = docSnap.data();
          setForm({
            title: productData.title || "",
            price: productData.price || 0,
            description: productData.description || "",
            category: productData.category || "",
            image: productData.image || "",
            rating: {
              rate: productData.rating?.rate || 0,
              count: productData.rating?.count || 0,
            },
          });
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


    // Handle form submission to update the product
  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      setError("Product ID is required");
      return;
    }

    try {
      await updateDoc(doc(db, "products", id), {
        title: form.title,
        price: form.price,
        description: form.description,
        category: form.category,
        image: form.image,
        rating: {
          rate: form.rating.rate,
          count: form.rating.count,
        },
      });

      setSuccess(true);

      // Hide success message after 3 seconds and navigate back
      setTimeout(() => {
        setSuccess(false);
        navigate("/");
      }, 2000);

      console.log("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product: ", error);
      setError("Failed to update product. Please try again.");
    }
  };

  // Handle form input changes and parse numeric values
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      setForm((prevState) => ({
        ...prevState,
        price: parseFloat(value) || 0,
      }));
    } else if (name === "rating") {
      setForm((prevState) => ({
        ...prevState,
        rating: {
          ...prevState.rating,
          rate: parseFloat(value) || 0,
        },
      }));
    } else if (name === "count") {
      setForm((prevState) => ({
        ...prevState,
        rating: {
          ...prevState.rating,
          count: parseInt(value) || 0,
        },
      }));
    } else {
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  console.log(form);

  // Handle loading state
  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading product data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => navigate("/")}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Edit Product</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form
            onSubmit={handleClick}
            className="d-flex flex-column p-4 border rounded shadow"
          >
            <label htmlFor="productTitle">Product Title: </label>
            <input
              className="w-100 p-2"
              type="text"
              id="productTitle"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <br />
            <label htmlFor="price">Price: </label>
            <input
              className="w-100 p-2"
              type="number"
              name="price"
              id="price"
              value={form.price}
              onChange={handleChange}
              required
            />
            <br />
            <label htmlFor="category">Category: </label>
            <input
              className="w-100 p-2"
              type="text"
              name="category"
              id="category"
              value={form.category}
              onChange={handleChange}
              required
            />
            <br />
            <label htmlFor="description">Description: </label>
            <textarea
              className="w-100 p-3"
              rows={4}
              value={form.description}
              id="description"
              name="description"
              onChange={handleChange}
              required
            >
              {" "}
            </textarea>
            <br />
            <label htmlFor="image">Image URL: </label>
            <input
              className="w-100 p-2"
              type="url"
              name="image"
              id="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />
            {form.image && (
              <div className="mt-2 mb-2 text-center">
                <img
                  src={form.image}
                  alt="Product Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "4px",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <br />
            <label htmlFor="rating">Rating: </label>
            <input
              className="w-100 p-2"
              type="number"
              min={0}
              max={5} 
              step={0.1} // Allow float numbers
              name="rating"
              id="rating"
              value={form.rating.rate}
              onChange={handleChange}
              required
            />
            <br />
            <label htmlFor="count">Count: </label>
            <input
              className="w-100 p-2"
              type="number"
              name="count"
              id="count"
              value={form.rating.count}
              onChange={handleChange}
              required
            />
            <br />
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-secondary flex-fill p-2"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              <button className="btn btn-primary flex-fill p-2" type="submit">
                Update Product
              </button>
            </div>
            {success && (
              <div className="alert alert-success mt-3" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                Product updated successfully! Redirecting...
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
