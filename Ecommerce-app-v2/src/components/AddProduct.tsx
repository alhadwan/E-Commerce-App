import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { href } from "react-router-dom";

// this component allows users to add a new product item to the product list

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

const AddProduct = () => {
  const [success, setSuccess] = useState(false);
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

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add the product with a timestamp
      await addDoc(collection(db, "products"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setForm({
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
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

      console.log("Product added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding product. Please try again.");
    }
  };

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
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Add New Product</h2>
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
            {/* {form.image && (
              <div className="mt-2 mb-2">
                <img
                  src={form.image}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )} */}
            <br />
            <label htmlFor="rating">Rating: </label>
            <input
              className="w-100 p-2"
              type="number"
              min={0}
              max={5}
              step={0.1}
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
            <button className="btn btn-primary w-100 p-2" type="submit">
              Add Product
            </button>
            {success && (
              <div className="alert alert-success mt-3" role="alert">
                Product added successfully!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
