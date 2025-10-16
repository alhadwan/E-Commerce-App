import { initializeApp } from "firebase/app"; //Initializes a Firebase app instance
import { getAuth } from "firebase/auth"; //Retrieves the authentication service associated with the Firebase app
import type { Auth } from "firebase/auth"; //A type representing Firebase Authentication
import { getFirestore } from "firebase/firestore";

//A type representing Firebase Authentication
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug: Log the config to see what's actually loaded (remove after testing)
console.log("Firebase Config:", {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "Found" : "Missing",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? "Found" : "Missing",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "Found" : "Missing",
});

// Initialize Firebase
const app = initializeApp(firebaseConfig); //Creates and initializes a Firebase app instance using the provided configuration object
const auth: Auth = getAuth(app); //Initializes and retrieves the Firebase Authentication service associated with the app instance
const db = getFirestore(app);

// Export the auth object for use in other parts of the application
export { auth, db };
