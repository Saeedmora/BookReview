import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const UserReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const { userId } = useParams();
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/users/${userId}/reviews`,
          {
            withCredentials: true,
          }
        );
        setReviews(response.data || []);
      } catch (error) {
        console.error('Fehler beim Abrufen der Reviews:', error);
        setReviews([]);
      }
    };

    fetchUserReviews();
  }, [userId]);

  const handleFavorite = async (reviewId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/me/favorites`,
        { reviewId },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          withCredentials: true,
        }
      );

      // Update the state to reflect the change in UI
      if (response.status === 200) {
        setReviews(reviews.map(review =>
          review._id === reviewId ? { ...review, isFavorite: true } : review
        ));
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen zu den Favoriten:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-4">
          <h2 className="text-3xl font-bold mb-4">Reviews von Benutzer</h2>
          {reviews.length > 0 ? (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li key={review._id} className="p-4 bg-white rounded-lg shadow-md">
                  <div 
                    className="cursor-pointer" 
                    onClick={() => navigate(`/book-reviews/${review.isbn}`)}
                  >
                    <h3 className="text-2xl font-semibold">
                      {review.bookTitle}
                    </h3>
                    <p className="mt-2">{review.review_text}</p>
                    <p className="mt-2 font-bold">Bewertung: {review.rating}</p>
                  </div>
                  <button
                    className="mt-2 text-red-500 hover:text-red-700 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite(review._id);
                    }}
                  >
                    ❤️ Zu Favoriten hinzufügen
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg">Keine Reviews vorhanden</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReviewsPage;
