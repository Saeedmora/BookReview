import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const { userData } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userData || !userData.user._id) {
        console.error('Benutzerdaten nicht verfügbar');
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8000/api/users/${userData.user._id}/favorites`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
            withCredentials: true,
          }
        );
        setFavorites(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Favoriten:', error);
      }
    };

    fetchFavorites();
  }, [userData]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-gray-100'>
      <Sidebar />
      <div className='flex-grow p-6'>
        <h2 className='text-2xl font-bold mb-6'>Meine Favoriten</h2>
        {favorites.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {favorites.map((book) => (
              <div
                key={book._id}
                className='bg-white p-4 rounded-lg shadow mb-4 flex flex-col items-center'
              >
                <img
                  src={book.book_image}
                  alt={book.title}
                  className='w-32 h-48 object-cover mb-4 rounded'
                />
                <h3 className='text-lg font-semibold mb-1'>{book.title}</h3>
                <p className='text-gray-700 mb-1'>by {book.author}</p>
                <p className='text-gray-500 mb-2'>ISBN: {book.isbn}</p>
                <button
                  className='bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 mb-2'
                  onClick={() => navigate(`/book-reviews/${book.isbn}`)}
                >
                  Mehr über das Buch erfahren
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500'>Keine Favoriten vorhanden</p>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
