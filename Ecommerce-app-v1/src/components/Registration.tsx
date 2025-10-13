import { useState } from "react";
import type { FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore"; //doc is the row reference and collection is the table reference

// Defines what data gets stored in Firestore database
interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: Date;
}
// Defines what data the form collects from user
interface RegistrationForm {
  name: string;
  email: string;
  password: string;
}

// This component handles user registration functionality
const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegistrationForm>({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // This function updates form state on input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // This function handles form submission and user registration
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      // Store additional user profile in Firestore not including password
      const userProfile: UserProfile = {
        uid: user.uid,
        name: form.name,
        email: user.email!,
        createdAt: new Date(),
      };
      // Use user.uid as the document ID to ensure uniqueness and easy retrieval
      await setDoc(doc(db, "users", user.uid), userProfile);
      setSuccess(true);
      setForm({ email: "", password: "", name: "" });
      navigate("/");
    } catch (error) {
      console.error("Error creating user: ", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div>
      <Form
        onSubmit={handleSubmit}
        className="d-flex flex-column align-items-center justify-content-center vh-100"
      >
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <p className="mt-3">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </Form>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">Registration successful!</p>}
    </div>
  );
};

export default Registration;
