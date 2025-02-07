const { Op } = require("sequelize");
const Book = require("../models/Book");
const Author = require("../models/Author");
const Review = require("../models/BookReview");

const resolvers = {
    Query: {
        books: async (_, { limit = 10, offset = 0, filter }) => {
            try {
                let whereCondition = {};
                if (filter?.title) whereCondition.title = { [Op.iLike]: `%${filter.title}%` };
                if (filter?.author_id) whereCondition.author_id = filter.author_id;
                if (filter?.published_date)  whereCondition.published_date = { [Op.between]: [`${filter.published_date} 00:00:00`, `${filter.published_date} 23:59:59`] };

                return await Book.findAll({
                    where: whereCondition,
                    limit,
                    offset,
                    include: Author,
                });
            } catch (error) {
                console.error("Error fetching books:", error);
                throw new Error("Error fetching books");
            }
        },

        authors: async (_, { limit = 10, offset = 0, filter }) => {
            try {
                let whereCondition = {};

                if (filter?.name) whereCondition.name = { [Op.iLike]: `%${filter.name}%` };
                if (filter?.born_date)  whereCondition.born_date = { [Op.between]: [`${filter.born_date} 00:00:00`, `${filter.born_date} 23:59:59`] };

                // Add logging to print the generated SQL query
                return await Author.findAll({
                    where: whereCondition,
                    limit,
                    offset,
                    include: Book,
                    logging: console.log,
                });
            } catch (error) {
                console.error("Error fetching authors:", error);
                throw new Error("Error fetching authors");
            }
        },


        book: async (_, { id }) => {
            try {
                return await Book.findByPk(id, { include: Author });
            } catch (error) {
                console.error("Error fetching book:", error);
                throw new Error("Error fetching book");
            }
        },

        author: async (_, { id }) => {
            try {
                return await Author.findByPk(id, { include: Book });
            } catch (error) {
                console.error("Error fetching author:", error);
                throw new Error("Error fetching author");
            }
        },
    },

    Mutation: {
        addBook: async (_, { title, description, published_date, author_id }) => {
            try {
                return await Book.create({ title, description, published_date, author_id });
            } catch (error) {
                console.error("Error adding book:", error);
                throw new Error("Error adding book");
            }
        },

        updateBook: async (_, { id, title, description, published_date, author_id }) => {
            try {
                const book = await Book.findByPk(id);
                if (!book) throw new Error("Book not found");

                await book.update({ title, description, published_date, author_id });
                return book;
            } catch (error) {
                console.error("Error updating book:", error);
                throw new Error("Error updating book");
            }
        },

        deleteBook: async (_, { id }) => {
            try {
                const book = await Book.findByPk(id);
                if (!book) throw new Error("Book not found");

                await book.destroy();
                return "Book deleted successfully";
            } catch (error) {
                console.error("Error deleting book:", error);
                throw new Error("Error deleting book");
            }
        },

        addAuthor: async (_, { name, biography, born_date }) => {
            try {
                console.log("Attempting to create author...");
                const author = await Author.create({ name, biography, born_date });
                console.log("Author created:", author);
                return author;
            } catch (error) {
                console.error("Error adding author:", error);
                throw new Error("Error adding author");
            }
        },


        updateAuthor: async (_, { id, name, biography, born_date }) => {
            try {
                const author = await Author.findByPk(id);
                if (!author) throw new Error("Author not found");

                await author.update({ name, biography, born_date });
                return author;
            } catch (error) {
                console.error("Error updating author:", error);
                throw new Error("Error updating author");
            }
        },

        deleteAuthor: async (_, { id }) => {
            try {
                const author = await Author.findByPk(id);
                if (!author) throw new Error("Author not found");

                await author.destroy();
                return "Author deleted successfully";
            } catch (error) {
                console.error("Error deleting author:", error);
                throw new Error("Error deleting author");
            }
        },

        addReview: async (_, { book_id, user, rating, review }) => {
            try {
                const newReview = new Review({ book_id, user, rating, review, review_date: new Date() });
                await newReview.save();
                return newReview;
            } catch (error) {
                console.error("Error adding review:", error);
                throw new Error("Error adding review");
            }
        },
    },

    Book: {
        author: async (book) => {
            try {
                return await Author.findByPk(book.author_id);
            } catch (error) {
                console.error("Error fetching author for book:", error);
                throw new Error("Error fetching author for book");
            }
        },
        reviews: async (book) => {
            try {
                const reviews = await Review.find({ book_id: String(book.id) });
                return reviews;
            } catch (error) {
                console.error("Error fetching reviews for book:", error);
                throw new Error("Error fetching reviews for book");
            }
        }
    },



    Author: {
        books: async (author) => {
            try {
                return await Book.findAll({ where: { author_id: author.id } });
            } catch (error) {
                console.error("Error fetching books for author:", error);
                throw new Error("Error fetching books for author");
            }
        },
        reviews: async (author) => {
            try {
                const books = await Book.findAll({ where: { author_id: author.id } });
                const bookIds = books.map(book => String(book.id));
                return await Review.find({ book_id: { $in: bookIds } });
            } catch (error) {
                console.error("Error fetching reviews for author:", error);
                throw new Error("Error fetching reviews for author");
            }
        }
    },
};

module.exports = resolvers;
