import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ProductPage = () => {
  const { _id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${_id}`);
        setProduct(res.data.data);

        const suggestedRes = await axios.get(
          `/api/products?category=${res.data.data.category}&limit=4`
        );
        setSuggestedProducts(
          suggestedRes.data.data.filter((p) => p._id !== _id)
        );
      } catch (err) {
        console.error("Products fetch failed", err);
        setError("Failed to load products.");
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/api/products/${_id}/interactions`);
        setReviews(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [_id]);

  const handleAddToCart = async (productToAdd, quantity = 1) => {
    setAdding(true);
    try {
      const success = await addToCart(productToAdd, quantity);
      if (!success) setError("Failed to add to cart.");
    } catch (err) {
      setError("Error adding to cart.");
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newRating === 0) {
      alert("Please select a rating.");
      return;
    }

    setSubmittingReview(true);

    const newReview = {
      rating: newRating,
      comment: newComment,
      userName: user?.name || "Anonymous",
      _id: "temp-id",
    };

    setReviews((prev) => [newReview, ...prev]);

    try {
      const res = await axios.post(`/api/products/${_id}/interactions`, {
        rating: newRating,
        comment: newComment,
        userName: user?.name || "Anonymous",
      });

      const realId = res.data.data._id;

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === "temp-id" ? { ...review, _id: realId } : review
        )
      );

      setNewRating(0);
      setNewComment("");
    } catch (err) {
      console.error("Review submit failed", err);
      alert("Failed to submit review.");
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== "temp-id")
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Product Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="flex-1">
          <img
            src={
              product.image ||
              "https://via.placeholder.com/300x300?text=Image+Not+Available"
            }
            alt={product.name}
            className="w-full object-contain max-h-[400px] bg-gray-100 p-4 rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-6 text-lg">{product.description}</p>
          <p className="text-2xl font-semibold text-blue-600 mb-6">
            ${product.price?.toFixed(2)}
          </p>

          {product.rating && (
            <div className="mb-6 flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-600 ml-2">
                ({product.rating.toFixed(1)})
              </span>
            </div>
          )}

          <button
            onClick={() => handleAddToCart(product)}
            className={`mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-medium ${
              adding ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={adding}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>

        {user ? (
          <form onSubmit={handleReviewSubmit} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className={`text-2xl ${
                    star <= newRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment (optional)"
              className="w-full p-3 border rounded-lg mb-4"
              rows="3"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={submittingReview}
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <p>
            Please <a href="/login" className="text-blue-600">log in</a> to submit a review.
          </p>
        )}

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first!</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="border p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                <p className="text-sm text-gray-500">by {review.userName}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Suggested Products */}
      {suggestedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestedProducts.map((suggested) => (
              <Link to={`/products/${suggested._id}`} key={suggested._id}>
                <div className="border rounded-lg p-4 hover:shadow-md transition">
                  <img
                    src={
                      suggested.image ||
                      "https://via.placeholder.com/300x300?text=Image+Not+Available"
                    }
                    alt={suggested.name}
                    className="w-full h-48 object-contain mb-4"
                  />
                  <h3 className="font-semibold mb-2">{suggested.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">
                    ${suggested.price?.toFixed(2)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(suggested);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
