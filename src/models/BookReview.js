const mongoose = require('mongoose');

const BookReviewSchema = new mongoose.Schema({
    book_id: { type: String, required: true },
    user: String,
    rating: Number,
    review: String,
    review_date: { type: Date, default: Date.now }
}, {
    collection: 'book_reviews'
});
module.exports = mongoose.model('BookReview', BookReviewSchema);
