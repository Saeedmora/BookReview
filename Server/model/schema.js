import mongoose from 'mongoose';
const { Schema } = mongoose;

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Benutzername ist erforderlich'],
    unique: true,
  },
  profileImageUrl: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'E-Mail ist erforderlich'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Passwort ist erforderlich'],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  reviews: [
    {
      review_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
});

// Book Schema
const bookSchema = new Schema({
  isbn: {
    type: String,
    required: [true, 'ISBN ist erforderlich'],
    unique: true,
  },
  title: {
    type: String,
    required: [true, 'Titel ist erforderlich'],
  },
  author: {
    type: String,
    required: [true, 'Autor ist erforderlich'],
  },
  book_image: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

// Review Schema
const reviewSchema = new Schema({
  isbn: {
    type: String,
    required: [true, 'ISBN ist erforderlich'],
  },
  review_text: {
    type: String,
    required: [true, 'Rezensionstext ist erforderlich'],
  },
  review_date: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Benutzer-ID ist erforderlich'],
  },
  username: {
    type: String,
    required: [true, 'Benutzername ist erforderlich'],
  },
  rating: {
    type: Number,
    required: [true, 'Bewertung ist erforderlich'],
    min: 1,
    max: 5,
  },
});

// Models
const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);
const Review = mongoose.model('Review', reviewSchema);

// Export all models as a single default export
const models = { User, Book, Review };
export default models;
