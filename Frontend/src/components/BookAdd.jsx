import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookAdd = ({ isbn }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [bookImage, setBookImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('isbn', isbn);
    formData.append('title', title);
    formData.append('author', author);
    formData.append('book_image', bookImage);

    try {
      await axios.post('http://localhost:8000/api/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/book-reviews/${isbn}`);
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Buches:', error);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Fehler beim Hinzufügen des Buches'
      );
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Neues Buch hinzufügen</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ISBN:</label>
          <input
            type="text"
            value={isbn}
            readOnly
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Titel:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Autor:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Buchbild:</label>
          <input
            type="file"
            onChange={(e) => setBookImage(e.target.files[0])}
            required
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          />
        </div>
        <button
          type="submit"
          className="mt-3 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Buch hinzufügen
        </button>
      </form>
    </div>
  );
};

export default BookAdd;
