import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { categories } from "../data/categories";

const seedCategories = async (): Promise<void> => {
  await Promise.all(
    categories.map((category) =>
      addDoc(collection(db, "categories"), {
        name: category,
      })
    )
  );
};

export default seedCategories;
