const mongoose = require('mongoose');

const AuthorMetadataSchema = new mongoose.Schema({
    author_id: { type: String, required: true },
    awards: [String],
    website: String,
    social_media: {
        twitter: String,
        instagram: String,
    },
});

module.exports = mongoose.model('AuthorMetadata', AuthorMetadataSchema);
