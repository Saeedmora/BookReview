import models from '../model/schema.js';
const { Book, User } = models;
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import axios from 'axios';

// UC01: Buch nach ISBN suchen inklusiv der Reviews
export const getBookByISBN = async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await Book.findOne({ isbn }).populate('reviews');

    if (!book) {
      return res.status(404).json({ message: 'Buch nicht gefunden.' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Neues Buch erfassen
export const addNewBook = asyncHandler(async (req, res, next) => {
  const { title, author, isbn, book_image } = req.body;

  // Check if the book already exists
  const existingBook = await Book.findOne({ isbn });
  if (existingBook) {
    return next(
      new ErrorResponse('Buch mit dieser ISBN existiert bereits', 400)
    );
  }

  const newBook = new Book({
    title,
    author,
    isbn,
    book_image,
  });

  await newBook.save();

  res.status(201).json({
    success: true,
    data: newBook,
  });
});

// Get top books
export const getTopBooks = async (req, res) => {
  try {
    const topBooks = await Book.aggregate([
      {
        $project: {
          title: 1,
          isbn: 1,
          book_image: 1,
          reviewCount: { $size: '$reviews' },
        },
      },
      { $sort: { reviewCount: -1 } },
      { $limit: 10 },
    ]);

    if (topBooks.length === 0) {
      return res.status(200).json({ message: 'Keine Bücher gefunden.', books: [] });
    }

    res.status(200).json({ books: topBooks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get user favorites
export const getUserFavorites = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return next(new ErrorResponse('Benutzer nicht gefunden.', 404));
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    console.error('Error fetching user favorites:', error.message);
    next(new ErrorResponse('Fehler beim Abrufen der Favoriten.', 500));
  }
});

// Search books and save them in the database if not exist
export const searchBooks = asyncHandler(async (req, res, next) => {
  const { query } = req.params;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );
    if (!response.data.items || response.data.items.length === 0) {
      return next(new ErrorResponse('Keine Bücher gefunden', 404));
    }

    const books = await Promise.all(response.data.items.map(async (item) => {
      const isbn = item.volumeInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier || 'ISBN nicht gefunden';
      const book = await Book.findOne({ isbn });

      if (!book) {
        const newBook = new Book({
          isbn,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unbekannter Autor',
          book_image: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : null,
        });

        await newBook.save();
        return newBook;
      }

      return book;
    }));

    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books from Google Books API:', error.message);
    return next(new ErrorResponse('Fehler beim Abrufen der Bücher', 500));
  }
});

// Add book to favorites
export const addBookToFavorites = asyncHandler(async (req, res, next) => {
  const { userId, bookId } = req.body;

  console.log(`Request received: { userId: '${userId}', bookId: '${bookId}' }`);

  try {
    let user = await User.findById(userId).populate('favorites');
    if (!user) {
      return next(new ErrorResponse('Benutzer nicht gefunden.', 404));
    }

    let book = await Book.findOne({ isbn: bookId });
    if (!book) {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${bookId}`
      );
      if (!response.data.items || response.data.items.length === 0) {
        return next(new ErrorResponse('Buch nicht gefunden.', 404));
      }

      const bookData = response.data.items[0].volumeInfo;
      book = new Book({
        isbn: bookId,
        title: bookData.title,
        author: bookData.authors ? bookData.authors.join(', ') : 'Unknown',
        book_image: bookData.imageLinks ? bookData.imageLinks.thumbnail : null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await book.save();
      console.log('Book saved to database:', book);
    }

    if (user.favorites.some((favorite) => favorite.isbn === book.isbn)) {
      return next(new ErrorResponse('Buch bereits in den Favoriten.', 400));
    }

    user.favorites.push(book._id);
    await user.save();

    user = await User.findById(userId).populate('favorites');

    res.status(200).json({
      message: 'Buch zu den Favoriten hinzugefügt.',
      favorites: user.favorites,
    });
  } catch (error) {
    console.error('Error adding book to favorites:', error.message);
    next(new ErrorResponse('Fehler beim Hinzufügen zu Favoriten.', 500));
  }
});
