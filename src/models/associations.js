const Author = require('./Author');
const Book = require('./Book');

Author.hasMany(Book, { foreignKey: 'author_id' });
Book.belongsTo(Author, { foreignKey: 'author_id' });

module.exports = { Author, Book };
