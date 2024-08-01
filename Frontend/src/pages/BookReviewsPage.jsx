import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

import ReviewItem from '../components/ReviewItem.jsx';

const BookReviewsPage = () => {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(1);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/books/${isbn}`, {
          withCredentials: true,
        });
        setBook(response.data);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Fehler beim Abrufen der Buchdaten und Bewertungen:', error);
      }
    };

    fetchBookAndReviews();
  }, [isbn]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!userData || !userData.user._id) {
      console.error('Benutzer nicht gefunden.');
      return;
    }

    const newReview = {
      isbn,
      review_text: newReviewText,
      rating: newReviewRating,
      user_id: userData.user._id,
      username: userData.user.username, // Ensure the username is passed
    };

    try {
      const response = await axios.post('http://localhost:8000/api/reviews', newReview, {
        withCredentials: true,
      });
      setReviews([...reviews, response.data.review]);
      setNewReviewText('');
      setNewReviewRating(1);
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Bewertung:', error);
      if (error.response) {
        console.error('Serverantwort:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Keine Antwort vom Server erhalten:', error.request);
      } else {
        console.error('Fehler bei der Erstellung der Anfrage:', error.message);
      }
    }
  };

  const handleFavorite = async (reviewId) => {
    if (!userData || !userData.user._id) {
      console.error('Benutzer nicht gefunden.');
      return;
    }
    try {
      await axios.post(`http://localhost:8000/api/me/favorites`, { reviewId }, {
        withCredentials: true,
      });
      // Optionally update the state to reflect the change
    } catch (error) {
      console.error('Fehler beim Hinzufügen zu den Favoriten:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {book && (
        <div className="max-w-4xl mx-auto p-4">
          <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
          <p className="text-lg mb-4">{book.author}</p>
          <img src={book.book_image} alt={book.title} className="w-48 h-64 object-cover mb-4" />
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + book.isbn)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Mehr über das Buch erfahren
          </a>
        </div>
      )}
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Bewertungen</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem key={review._id} review={review} onFavorite={handleFavorite} />
          ))}
        </div>
        {userData && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Neue Bewertung hinzufügen</h3>
            <form onSubmit={handleAddReview} className="space-y-4">
              <textarea
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
              <select
                value={newReviewRating}
                onChange={(e) => setNewReviewRating(Number(e.target.value))}
                className="p-2 border border-gray-300 rounded"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Stars
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Bewertung hinzufügen
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookReviewsPage;
