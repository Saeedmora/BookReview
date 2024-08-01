import models from '../model/schema.js';
const { User, Review } = models;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// JWT Token generieren
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Benutzerregistrierung
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const profileImageUrl = req.file ? req.file.path : req.body.profileImageUrl;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Alle Felder sind erforderlich' });
    }

    // Überprüfen, ob der Benutzer existiert
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Benutzer mit dieser E-Mail existiert bereits' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 12);

    // Neuen Benutzer erstellen
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImageUrl,
    });

    await newUser.save();

    // JWT Token erstellen
    const token = generateToken(newUser._id);

    // Setzen Sie das Token in Cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Benutzerlogin
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Überprüfen, ob der Benutzer existiert
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Ungültige Anmeldedaten' });
    }

    // Passwort überprüfen
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Ungültige Anmeldedaten' });
    }

    // JWT Token erstellen
    const token = generateToken(user._id);

    // Setzen Sie das Token in Cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Benutzer ausloggen
export const logoutUser = async (req, res) => {
  try {
    // Entfernen Sie das Token aus den Cookies
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: 'Benutzer erfolgreich ausgeloggt.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Aktuellen Benutzer abrufen
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // Passwort entfernen
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bewertungen des aktuellen Benutzers anzeigen
export const getCurrentUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user_id: req.user._id });

    if (!reviews) {
      return res.status(404).json({ message: 'Keine Reviews gefunden.' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bewertungen eines bestimmten Benutzers anzeigen
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviews = await Review.find({ user_id: userId }).populate('user_id', 'username profileImageUrl');

    if (!reviews) {
      return res.status(404).json({ message: 'Keine Reviews gefunden.' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Top-Reviewer anzeigen
export const getTopReviewer = async (req, res) => {
  try {
    const topReviewer = await User.aggregate([
      {
        $project: {
          username: 1,
          profileImageUrl: 1,
          reviewCount: { $size: '$reviews' },
        },
      },
      {
        $sort: { reviewCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    if (topReviewer.length === 0) {
      return res.status(200).json({ message: 'Keine Reviewer gefunden.', reviewers: [] });
    }

    res.status(200).json({ reviewers: topReviewer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bewertungen zu Favoriten hinzufügen
export const addReviewToFavorites = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { reviewId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
    }

    if (user.favorites.includes(reviewId)) {
      return res.status(400).json({ message: 'Rezension bereits in den Favoriten.' });
    }

    user.favorites.push(reviewId);
    await user.save();

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Favoriten eines Benutzers abrufen
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId).populate('favorites');

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Profilbild hochladen
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user._id; // Verwenden Sie den angemeldeten Benutzer
    const profileImageUrl = req.file ? req.file.path : null;

    if (!profileImageUrl) {
      return res.status(400).json({ message: 'Profilbild ist erforderlich' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    res.status(200).json({ profileImageUrl: user.profileImageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
