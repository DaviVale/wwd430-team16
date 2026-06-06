"use client";

import { useMemo, useState } from "react";

type Review = {
  id: number;
  author: string;
  rating: number;
  comment: string;
};

const initialReviews: Review[] = [
  {
    id: 1,
    author: "Sarah",
    rating: 5,
    comment: "High quality",
  },
  {
    id: 2,
    author: "Michael",
    rating: 4,
    comment: "I loved the product!",
  },
];

export default function ProductReviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const averageRating = useMemo(() => {
    return (
      reviews.reduce((acc, review) => acc + review.rating, 0) /
      reviews.length
    ).toFixed(1);
  }, [reviews]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!comment.trim()) return;

    const newReview: Review = {
      id: Date.now(),
      author: "Anonymous User",
      rating,
      comment,
    };

    setReviews([newReview, ...reviews]);
    setComment("");
    setRating(5);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="border-t pt-10">
        <h2 className="text-2xl font-bold">Reviews & Ratings</h2>

        <div className="mt-4">
          <span className="text-3xl font-bold">{averageRating}</span>
          <span className="ml-2 text-gray-500">
            / 5 ({reviews.length} reviews)
          </span>
        </div>

        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border bg-white p-4"
            >
              <div className="font-semibold">{review.author}</div>

              <div className="text-yellow-500">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <p className="mt-2 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-10">
          <h3 className="mb-4 text-xl font-semibold">
            Leave a Review
          </h3>

          <label className="block">
            Rating
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 w-full rounded border p-2"
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </label>

          <label className="mt-4 block">
            Comment
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded border p-2"
              required
            />
          </label>

          <button
            type="submit"
            className="mt-4 rounded bg-[#28582e] px-5 py-2 text-white"
          >
            Submit Review
          </button>
        </form>
      </div>
    </section>
  );
}