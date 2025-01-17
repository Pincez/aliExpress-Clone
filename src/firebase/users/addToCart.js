// src/firebase/users/addToCart.js
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

const addToCart = async (userId, cartItem) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      cart: arrayUnion(cartItem),
    });
    console.log("Product added to cart.");
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export default addToCart;
