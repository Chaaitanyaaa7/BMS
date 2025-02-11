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
                if (!id) throw new Error("Book ID is required.");

                const book = await Book.findByPk(id, { include: Author });

                if (!book) throw new Error(`Book with ID ${id} not found.`);
                return book;
            } catch (error) {
                console.error("Error fetching book:", error);
                throw new Error(error.message);
            }
        },

        author: async (_, { id }) => {
            try {
                if (!id) throw new Error("Author ID is required.");

                const author = await Author.findByPk(id, { include: Book });
                if (!author) throw new Error(`Author with ID ${id} not found.`);

                return author;
            } catch (error) {
                console.error("Error fetching author:", error.message);
                throw new Error(error.message);
            }
        },
        booksCount: async () => {
            try {
                return await Book.count();
            } catch (error) {
                console.error("Error fetching books count:", error);
                throw new Error("Error fetching books count");
            }
        },

        authorsCount: async () => {
            try {
                return await Author.count();
            } catch (error) {
                console.error("Error fetching authors count:", error);
                throw new Error("Error fetching authors count");
            }
        },
        getallauthors: async () => {
            try {
                return await Author.findAll({
                    attributes: ["id", "name", "biography", "born_date"],
                });
            } catch (error) {
                console.error("Error fetching all authors:", error);
                throw new Error("Error fetching all authors");
            }
        },


    },

    Mutation: {
        addBook: async (_, { title, description, published_date, author_id }) => {
            try {
                if (!title.trim()) throw new Error("Title is required.");
                if (!author_id) throw new Error("Author ID is required.");

                const authorExists = await Author.findByPk(author_id);
                if (!authorExists) throw new Error(`Author with ID ${author_id} not found.`);

                return await Book.create({ title, description, published_date, author_id });
            } catch (error) {
                console.error("Error adding book:", error.message);
                throw new Error(error.message); // Return the actual error message
            }
        },

        updateBook: async (_, { id, title, description, published_date, author_id }) => {
            try {
                const book = await Book.findByPk(id);
                if (!book) throw new Error("Book not found");

                if (author_id) {
                    const authorExists = await Author.findByPk(author_id);
                    if (!authorExists) throw new Error("Author not found.");
                }

                await book.update({ title, description, published_date, author_id });
                return book;

            } catch (error) {
                console.error("Error updating book:", error);
                throw new Error(error.message);
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
                throw new Error(error.message);
            }
        },

        addAuthor: async (_, { name, biography, born_date }) => {
            try {
                if (!name) throw new Error("Author name is required.");
                const existingAuthor = await Author.findOne({ where: { name, born_date } });
                if (existingAuthor) {
                    throw new Error("Author already exists with the same name and born_date.");
                }

                return await Author.create({ name, biography, born_date });
            } catch (error) {
                console.error("Error adding author:", error);
                throw new Error(error.message);
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
                throw new Error(error.message);
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
                throw new Error(error.message);
            }
        },

        addReview: async (_, { book_id, user, rating, review }) => {
            try {
                if (!book_id || !user || !rating || !review)
                    throw new Error("Book ID, user, rating, and review are required.");

                const bookExists = await Book.findByPk(book_id);
                if (!bookExists) throw new Error("Book not found.");

                const newReview = new Review({ book_id, user, rating, review, review_date: new Date() });
                await newReview.save();
                return newReview;

            } catch (error) {
                console.error("Error adding review:", error);
                throw new Error(error.message);
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
