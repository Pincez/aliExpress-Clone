// src/firebase/users/addRatingAndComment.js
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

const addRatingAndComment = async (productId, interaction) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      ratings: arrayUnion({
        userId: interaction.userId,
        rating: interaction.rating,
        comment: interaction.comment,
        timestamp: interaction.timestamp,
      }),
    });
    console.log("Rating and comment added successfully.");
  } catch (error) {
    console.error("Error adding rating and comment:", error);
    throw error;
  }
};

export default addRatingAndComment;
