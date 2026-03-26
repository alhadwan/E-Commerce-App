import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

//This component is a custom hook to manage authentication state and user profile data

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  createdAt: Date;
}

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
      const userDoc = doc(db, "users", userId); // a pointer to the user document in Firestore
      await updateDoc(userDoc, updatedData); // updateData = updateUser(userId, updatedData) 
      console.log("Firestore updated successfully");

      // Update local state immediately so UI updates 
      if (user && user.uid === userId) {
        //merges old profile + new changed fields.
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

// Listen for authentication state changes and get the user data for whoever is signed in.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser); //it contain the user whoever signed in
      if (currentUser) {
        try {
          //get the user info that just signed in
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile); // Set user profile data from Firestore
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
