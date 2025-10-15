import { useState } from "react";
import { db } from "../firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

// This component allows users to delete a product by its ID.

const DeleteProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  // Handle product deletion
  const handleDelete = async () => {
    if (!id) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "products", id));
      setSuccess(true);
      navigate("/");
    } catch (error) {
      console.error("Error deleting product: ", error);
      alert("Failed to delete product. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <button
        className="btn btn-danger w-100 mt-2"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete Product"}
      </button>
      {success && <p className="text-success">Product deleted successfully!</p>}
    </div>
  );
};

export default DeleteProduct;
