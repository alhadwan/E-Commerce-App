import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { data } from "../data/data";

const seedProduct = async (): Promise<void> => {
  await Promise.all(
    data.map((p) =>
      addDoc(collection(db, "products"), {
        title: p.title,
        price: p.price,
        description: p.description,
        category: p.category,
        image: p.image,
        rating: { rate: p.rating.rate, count: p.rating.count },
        createdAt: serverTimestamp(),
      })
    )
  );
};

export default seedProduct;
