import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar.jsx';
import BookList from '../components/BookList.jsx';
import TopReviewers from '../components/TopReviewers.jsx';
import { SpinnerDotted } from 'spinners-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart as faSolidHeart,
  faSearch,
  faBookOpen,
  faUsers,
  faPenNib,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Fade } from 'react-awesome-reveal';

const MainPage = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookNotFound, setBookNotFound] = useState(false);
  const [topBooks, setTopBooks] = useState([]);
  const [showTopBooks, setShowTopBooks] = useState(true);
  const { userData, updateUserData } = useAuth();
  const [favorites, setFavorites] = useState(
    userData ? userData.user.favorites : []
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setFavorites(userData.user.favorites);
    }
  }, [userData]);

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/top-books');
        setTopBooks(response.data.books);
      } catch (error) {
        console.error('Fehler beim Abrufen der Top-Bücher:', error);
        setTopBooks([]);
      }
    };

    fetchTopBooks();
  }, []);

  const handleSearch = async () => {
    if (!query) {
      console.error('Suchanfrage ist erforderlich');
      return;
    }
    setLoading(true);
    setShowTopBooks(false);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/search/${query}`,
        {
          withCredentials: true,
        }
      );
      setBooks(response.data);
      setBookNotFound(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setBookNotFound(true);
      } else {
        console.error('Fehler beim Abrufen der Buchdaten:', error);
      }
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const addToFavorites = async (isbn) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/favorites`,
        { userId: userData.user._id, bookId: isbn },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          withCredentials: true,
        }
      );

      const updatedFavorites = response.data.favorites;
      setFavorites(updatedFavorites);

      updateUserData({
        ...userData,
        user: { ...userData.user, favorites: updatedFavorites },
      });

      console.log('Buch zu Favoriten hinzugefügt:', response.data);
    } catch (error) {
      console.error('Fehler beim Hinzufügen zu Favoriten:', error);
    }
  };

  const renderBooks = (booksToRender) => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {booksToRender.map((book) => (
        <div
          key={book.isbn}
          className='relative border p-4 rounded-md shadow-md flex flex-col items-center'
        >
          <img
            src={book.book_image}
            alt={book.title}
            className='w-32 h-48 object-cover mt-2'
            draggable='false'
          />
          <button
            className='absolute top-2 right-2 text-red-500'
            onClick={() => addToFavorites(book.isbn)}
          >
            <FontAwesomeIcon
              icon={
                favorites.some((fav) => fav.isbn === book.isbn)
                  ? faSolidHeart
                  : faRegularHeart
              }
              size='1x'
            />
          </button>
          <h2 className='text-xl font-bold mt-2'>{book.title}</h2>
          <p className='text-gray-700'>{book.author}</p>
          <button
            className='mt-2 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-700'
            onClick={() => navigate(`/book-reviews/${book.isbn}`)}
          >
            Watch Reviews
          </button>
        </div>
      ))}
    </div>
  );

  const renderHowToUse = () => (
    <div className='mt-80'>
      <Fade duration={1000} delay={400} direction='right'>
        <div className='absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-full shadow-md flex flex-col items-center w-40 h-40'>
          <FontAwesomeIcon
            icon={faSearch}
            size='3x'
            className='text-blue-500 mb-4 '
          />
          <h3 className='text-lg font-semibold text-center'>
            Search for Books
          </h3>
        </div>
      </Fade>
      <Fade duration={1000} delay={600} direction='left'>
        <div className='absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-full shadow-md flex flex-col items-center w-40 h-40'>
          <FontAwesomeIcon
            icon={faBookOpen}
            size='3x'
            className='text-green-500 mb-4'
          />
          <h3 className='text-lg font-semibold text-center'>Read Reviews</h3>
        </div>
      </Fade>
      <Fade duration={1000} delay={200} direction='up'>
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 p-4 bg-white rounded-full shadow-md flex flex-col items-center w-40 h-40'>
          <FontAwesomeIcon
            icon={faUser}
            size='3x'
            className='text-orange-500 mb-4'
          />
          <h3 className='text-lg font-semibold text-center'>
            Join the Community!
          </h3>
        </div>
      </Fade>
      <Fade duration={1000} delay={800} direction='down'>
        <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 p-4 bg-white rounded-full shadow-md flex flex-col items-center w-40 h-40'>
          <FontAwesomeIcon
            icon={faPenNib}
            size='3x'
            className='text-purple-500 mb-4'
          />
          <h3 className='text-lg font-semibold text-center'>Write Reviews</h3>
        </div>
      </Fade>
    </div>
  );

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex flex-1'>
        <Sidebar />
        <div className='flex-1 flex flex-col lg:flex-row p-4'>
          <div className='w-full lg:w-2/3 p-4'>
            <div className='flex mb-4'>
              <input
                type='text'
                placeholder='Search after ISBN, Titel or Author'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className='flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none'
              />
              <button
                onClick={handleSearch}
                className='p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-700'
              >
                Search
              </button>
            </div>
            {loading && (
              <div className='flex justify-center items-center h-screen'>
                <SpinnerDotted
                  size={100}
                  thickness={100}
                  speed={100}
                  color='rgba(37, 107, 172, 1)'
                />
              </div>
            )}
            {bookNotFound && <p>Kein Buch gefunden</p>}
            {showTopBooks ? renderHowToUse() : renderBooks(books)}
          </div>
          <div className='w-full lg:w-1/3 p-4'>
            <TopReviewers />
            <BookList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
