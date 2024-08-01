import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import { Carousel } from 'react-responsive-carousel';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faBookOpen,
  faPenNib,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Fade } from 'react-awesome-reveal';

const LandingPage = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/top-books');
        setTopBooks(response.data.books);
      } catch (error) {
        console.error('Fehler beim Abrufen der Top-Bücher:', error);
        setTopBooks([]); // Fallback auf leeres Array bei Fehler
      }
    };

    const fetchReviewers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/topreviewer'
        );
        setReviewers(response.data.reviewers);
      } catch (error) {
        console.error('Fehler beim Abrufen der Reviewer:', error);
        setReviewers([]); // Fallback auf leeres Array bei Fehler
      }
    };

    fetchTopBooks();
    fetchReviewers();
  }, []);

  const renderTopBooks = () => (
    <Carousel
      showArrows={true}
      showThumbs={false}
      showStatus={false}
      infiniteLoop={true}
      autoPlay={true}
      interval={5000}
      centerMode={true}
      centerSlidePercentage={33.33}
      emulateTouch
    >
      {topBooks.map((book) => (
        <div key={book._id} className='p-4'>
          <div className='relative pb-[150%]'>
            <img
              src={book.book_image}
              alt={book.title}
              className='absolute top-0 left-0 w-full h-full object-cover rounded-md'
            />
          </div>
          <h3 className='text-lg font-semibold mb-1 text-center'>
            {book.title}
          </h3>
          <div className='my-12'></div>
        </div>
      ))}
    </Carousel>
  );

  const renderReviewers = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {reviewers.map((reviewer) => (
        <div key={reviewer._id} className='p-4'>
          <img
            src={
              reviewer.profileImageUrl ||
              'https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg'
            }
            alt={reviewer.username}
            className='w-32 h-32 object-cover mb-4 rounded-full mx-auto'
          />
          <h3 className='text-lg font-semibold mb-1 text-center'>
            {reviewer.username}
          </h3>
          <p className='text-center'>{reviewer.reviewCount} Reviews</p>
        </div>
      ))}
    </div>
  );

  const renderHowToUse = () => (
    <div className='flex flex-col space-y-4'>
      <Fade duration={2000} delay={200} direction='up'>
        <div className='p-4 bg-white rounded-lg shadow-md flex flex-col items-center'>
          <FontAwesomeIcon
            icon={faUser}
            size='3x'
            className='text-orange-500 mb-4'
          />
          <h3 className='text-lg font-semibold mb-2'>Create an Account</h3>
          <p className='text-center text-gray-700'>
            Join our community by creating a free account to start sharing your
            reviews.
          </p>
        </div>
      </Fade>
      <Fade duration={2000} delay={200} direction='right'>
        <div className='p-4 bg-white rounded-lg shadow-md flex flex-col items-center'>
          <FontAwesomeIcon
            icon={faSearch}
            size='3x'
            className='text-blue-500 mb-4'
          />
          <h3 className='text-lg font-semibold mb-2'>Search for Books</h3>
          <p className='text-center text-gray-700'>
            Use the search bar above to find books by ISBN, title, or author.
          </p>
        </div>
      </Fade>
      <Fade duration={3000} delay={200} direction='left'>
        <div className='p-4 bg-white rounded-lg shadow-md flex flex-col items-center'>
          <FontAwesomeIcon
            icon={faBookOpen}
            size='3x'
            className='text-green-500 mb-4'
          />
          <h3 className='text-lg font-semibold mb-2'>Read Reviews</h3>
          <p className='text-center text-gray-700'>
            Read reviews from other users to find out more about the book.
          </p>
        </div>
      </Fade>
      <Fade duration={5000} delay={200} direction='down'>
        <div className='p-4 bg-white rounded-lg shadow-md flex flex-col items-center'>
          <FontAwesomeIcon
            icon={faPenNib}
            size='3x'
            className='text-purple-500 mb-4'
          />
          <h3 className='text-lg font-semibold mb-2'>Write Reviews</h3>
          <p className='text-center text-gray-700'>
            Share your thoughts and reviews on the books you've read.
          </p>
        </div>
      </Fade>
    </div>
  );

  return (
    <div className='min-h-screen flex flex-col items-center bg-gray-100'>
      <div className='w-full max-w-4xl p-4'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4'>
            Welcome to our Book Community!
          </h1>
          <p className='text-3xl mb-4 font-handwritten font-semibold'>
            Let's inspire each other and share our passion for books. Discover
            new books, write reviews, and find like-minded people
          </p>
          {!userData ? (
            <Link
              to='/register'
              className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700'
            >
              Register here
            </Link>
          ) : (
            ''
          )}
        </div>

        <div className='mb-12'>{renderHowToUse()}</div>

        <div className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6'>Top Bücher</h2>
          {renderTopBooks()}
        </div>

        <div>
          <h2 className='text-2xl font-semibold mb-6'>Top Reviewer</h2>
          {renderReviewers()}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
