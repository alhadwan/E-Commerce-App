import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

//This component is a custom hook to manage authentication state and user profile data

//Defines the structure of user data stored in Firestore
interface UserProfile {
  uid: string;
  email: string;
  name: string;
  createdAt: Date;
}
// Defines what useAuth hook returns
interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  updateUser: (
    userId: string,
    updatedData: Partial<UserProfile>
  ) => Promise<void>;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);


  // Function to update user profile in Firestore and local state
  const updateUser = async (
    userId: string,
    updatedData: Partial<UserProfile>
  ) => {
    try {
      // Update Firestore first
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, updatedData);
      console.log("Firestore updated successfully");

      // Update local state immediately so UI updates
      
      if (user && user.uid === userId) {
        setUserProfile((prev) => {
          const newProfile = prev ? { ...prev, ...updatedData } : null;
          console.log("Updated local profile:", newProfile);
          return newProfile;
        });
      } else {
        console.log("User mismatch or no user:", {
          currentUser: user?.uid,
          updateUserId: userId,
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

// Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser); //it contain the user whoever signed in
      if (currentUser) {
        try {
          //get the user info that just signed in
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  // user: The currently authenticated user object (or null if not authenticated)
  // userProfile: The user's profile data fetched from Firestore (or null if not available)
  // loading: A boolean indicating if the authentication state is still being determined
  // updateUser: A function to update the user's profile data in Firestore and local state
  return { user, userProfile, loading, updateUser };
};
