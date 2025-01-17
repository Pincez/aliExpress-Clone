// src/firebase/products/saveProductData.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const saveProductData = async (productId, productData) => {
  try {
    await setDoc(doc(db, "products", productId), productData);
    console.log("Product data saved successfully.");
  } catch (error) {
    console.error("Error saving product data:", error);
    throw error;
  }
};

export default saveProductData;
