import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/top-books');
        setBooks(response.data.books || []);
      } catch (error) {
        console.error('Fehler beim Abrufen der Top-Bücher:', error);
        setBooks([]); // Fallback to an empty array on error
      }
    };

    fetchTopBooks();
  }, []);

  const handleViewReviews = (isbn) => {
    navigate(`/book-reviews/${isbn}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Most Reviewed Books</h2>
      <div className="overflow-x-auto whitespace-no-wrap">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className="inline-block w-48 p-4 m-2 bg-gray-100 rounded-lg shadow-md">
              <img src={book.book_image} alt={book.title} className="w-full h-48 object-cover rounded-md mb-2" />
              <span className="block text-lg font-semibold mb-2">{book.title}</span>
              <button
                onClick={() => handleViewReviews(book.isbn)}
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Watch Reviews
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No books available</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
