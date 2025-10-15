import { db } from "../firebaseConfig";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../Redux./cartSlice.ts";
import type { AppDispatch } from "../Redux./store";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import {
  deleteDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// This component allows users to delete their account, including profile and order history, after re-authentication.

const DeleteAccount = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    const password = prompt("Please enter your current password to confirm:");
    if (!password) {
      alert("Password is required to delete account.");
      return;
    }

    if (authLoading) {
      console.log("Authentication state is still loading...");
      return;
    }

    if (!user) {
      setError("User not authenticated");
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      console.log("Re-authentication successful");

      // Delete user's orders first
      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );
      const ordersSnapshot = await getDocs(ordersQuery);

      // Delete all user's orders so we don't leave orphaned data
      const deletePromises = ordersSnapshot.docs.map((orderDoc) =>
        deleteDoc(doc(db, "orders", orderDoc.id))
      );
      await Promise.all(deletePromises);
      console.log("User orders deleted from Firestore");

      // Clear Redux store
      dispatch(clearCart());
      console.log("Redux store cleared");

      // Delete user profile
      await deleteDoc(doc(db, "users", user.uid));
      console.log("User profile deleted from Firestore");

      // lastly Delete Firebase Auth account
      await deleteUser(user);
      alert("Account successfully deleted.");
      navigate("/login");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.code === "auth/requires-recent-login") {
        setError("Please log out and log back in, then try again.");
      } else {
        setError("Failed to delete account: " + error.message);
      }
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="container mt-4">
      <h3 className="text-danger">Danger Zone</h3>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card border-danger">
        <div className="card-body">
          <h5 className="card-title text-danger">Delete Account</h5>
          <p className="card-text">
            Once you delete your account, there is no going back. This will
            permanently delete:
          </p>
          <ul>
            <li>Your profile information</li>
            <li>All your order history</li>
            <li>All associated data</li>
          </ul>
          <button
            className="btn btn-danger"
            onClick={handleDeleteAccount}
            disabled={deleting || authLoading}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
