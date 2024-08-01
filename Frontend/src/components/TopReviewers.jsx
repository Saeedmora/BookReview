import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//mehere top reviewer
const TopReviewers = () => {
  const [topReviewers, setTopReviewers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopReviewers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/topreviewer'
        );
        setTopReviewers(response.data.reviewers || []);
      } catch (error) {
        console.error('Fehler beim Abrufen der Top-Reviewer:', error);
        setTopReviewers([]); // Fallback to an empty array on error
      }
    };

    fetchTopReviewers();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/user-reviews/${userId}`);
  };

  return (
    <div className='p-4 bg-white shadow rounded-md mb-4'>
      <h2 className='text-2xl font-bold mb-4'>Top Reviewer</h2>
      {topReviewers.length > 0 ? (
        <ul className='space-y-4'>
          {topReviewers.map((reviewer) => (
            <li
              key={reviewer._id}
              onClick={() => handleUserClick(reviewer._id)}
              className='flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded'
            >
              <img
                src={reviewer.profileImageUrl}
                alt={reviewer.username}
                className='w-12 h-12 rounded-full mr-4'
              />
              <div>
                <span className='block font-semibold'>{reviewer.username}</span>
                <span className='block text-gray-600'>
                  {reviewer.reviewCount} Reviews
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-gray-600'>Keine Reviewer gefunden.</p>
      )}
    </div>
  );
};

export default TopReviewers;
