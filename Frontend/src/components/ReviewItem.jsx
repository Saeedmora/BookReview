import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReviewItem = ({ review, onFavorite }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/book-reviews/${review.isbn}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer" onClick={handleNavigate}>
      {review.book && (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">{review.book.title}</h3>
          <p className="text-gray-700 mb-2">{review.book.author}</p>
          <img
            src={review.book.book_image}
            alt={review.book.title}
            className="w-32 h-40 object-cover mb-2"
          />
          <button
            className="text-blue-500 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
          >
            Mehr über das Buch erfahren
          </button>
        </div>
      )}
      <p className="text-gray-800 mb-2">{review.review_text}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">{review.username}</span>
        <span className="text-sm text-gray-600">{review.rating} Stars</span>
      </div>
      <button
        className="mt-2 text-red-500 hover:text-red-700 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          onFavorite(review._id);
        }}
      >
        ❤️
      </button>
    </div>
  );
};

export default ReviewItem;
