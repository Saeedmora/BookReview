import models from '../model/schema.js';
const { User, Review, Book } = models;

// UC03: Rezension zu einem Buch hinzufügen
export const addReview = async (req, res) => {
  try {
    const { isbn, review_text, user_id, rating } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
    }

    let book = await Book.findOne({ isbn });
    if (!book) {
      return res.status(404).json({ message: 'Buch nicht gefunden.' });
    }

    const review = new Review({ isbn, review_text, user_id, username: user.username, rating });
    await review.save();

    book.reviews.push(review._id);
    await book.save();

    user.reviews.push({ review_id: review._id });
    await user.save();

    res.status(201).json({ message: 'Rezension erfolgreich hinzugefügt.', review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UC07: Rezension löschen
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.body.user_id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Rezension nicht gefunden.' });
    }

    // Überprüfen, ob die Rezension dem Benutzer gehört
    if (review.user_id.toString() !== userId) {
      return res.status(403).json({ message: 'Sie haben keine Berechtigung, diese Rezension zu löschen.' });
    }

    await review.remove();

    // Entfernen der Rezension aus dem Benutzer-Dokument
    await User.updateOne(
      { _id: userId },
      { $pull: { reviews: { review_id: reviewId } } }
    );

    // Entfernen der Rezension aus dem Buch-Dokument
    await Book.updateOne(
      { isbn: review.isbn },
      { $pull: { reviews: reviewId } }
    );

    res.status(200).json({ message: 'Rezension erfolgreich gelöscht.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
