import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { db, auth } from "../firebase/firebase"; // Ensure auth is imported
import { collection, addDoc, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import SuggestedProducts from "../components/SuggestedProducts";
import all_product from "../assets/Frontend_Assets/all_product";

const ProductPage = ({ product }) => {
  const { addToCart } = useCart();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [userFullName, setUserFullName] = useState("");

  // Firestore collection reference
  const commentsCollectionRef = collection(db, "productInteractions");

  // Fetch comments from Firestore
  const fetchComments = async () => {
    try {
      const q = query(commentsCollectionRef, where("productId", "==", product.id));
      const querySnapshot = await getDocs(q);
      const fetchedComments = querySnapshot.docs.map((doc) => doc.data());
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Fetch authenticated user details
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user's full name from Firestore
        const userDocRef = doc(db, "users", currentUser.uid); // Assuming users are stored in the "users" collection
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserFullName(userDoc.data().fullName);
        }
      } else {
        setUser(null);
        setUserFullName("");
      }
    });
    return () => unsubscribe();
  }, []);

  // Submit a new comment to Firestore
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to post a comment.");
      return;
    }
    if (newComment.trim() && rating > 0) {
      const commentData = {
        productId: product.id,
        comment: newComment,
        rating,
        timestamp: new Date(),
        userName: userFullName || "Anonymous User", // Use fullName or fallback
      };

      try {
        await addDoc(commentsCollectionRef, commentData);
        setComments([...comments, commentData]);
        setNewComment("");
        setRating(0);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    } else {
      alert("Please provide a valid comment and rating.");
    }
  };

  useEffect(() => {
    if (product) {
      fetchComments();
    }
  }, [product]);

  // Suggested products logic
  const suggestedProducts = all_product
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Product not found.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 object-cover rounded-lg"
        />

        {/* Product Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h2>
          <p className="text-lg text-gray-700 mb-4">${product.new_price.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mb-6">{product.description}</p>

          {/* Rating Section */}
          <div className="mb-4">
            <h4 className="text-lg font-medium text-gray-800 mb-2">Rate this product:</h4>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl ${
                    star <= (hover || rating) ? "text-yellow-500" : "text-gray-400"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart({ ...product, quantity: 1 })}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h3>
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your review here..."
            className="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Review
          </button>
        </form>

        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment, index) => (
              <li key={index} className="border rounded-lg p-4 bg-gray-100">
                <p className="text-gray-800">{comment.comment}</p>
                <p className="text-sm text-yellow-500">
                  {"★".repeat(comment.rating)}{" "}
                  <span className="text-gray-500">({comment.rating} stars)</span>
                </p>
                <p className="text-sm text-gray-600">- {comment.userName}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Suggested Products */}
      <SuggestedProducts products={suggestedProducts} />
    </div>
  );
};

export default ProductPage;
