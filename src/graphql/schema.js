const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    biography: String
    born_date: String
    books: [Book]
    reviews: [Review]
  }

  type Book {
    id: ID!
    title: String!
    description: String
    published_date: String
    author: Author
    reviews: [Review]
  }

  type Review {
    id: ID!
    book_id: ID!
    user: String!
    rating: Int!
    review: String!
    review_date: String
  }

  input BookFilter {
    title: String
    author_id: ID
    published_date: String
  }

  input AuthorFilter {
    name: String
    born_date: String
  }

  type Query {
    books(limit: Int, offset: Int, filter: BookFilter): [Book]
    authors(limit: Int, offset: Int, filter: AuthorFilter): [Author]
    book(id: ID!): Book
    author(id: ID!): Author
  }

  type Mutation {
    addBook(title: String!, description: String, published_date: String, author_id: ID!): Book
    updateBook(id: ID!, title: String, description: String, published_date: String, author_id: ID): Book
    deleteBook(id: ID!): String

    addAuthor(name: String!, biography: String, born_date: String): Author
    updateAuthor(id: ID!, name: String, biography: String, born_date: String): Author
    deleteAuthor(id: ID!): String

    addReview(book_id: ID!, user: String!, rating: Int!, review: String!): Review
  }
`;

module.exports = typeDefs;
