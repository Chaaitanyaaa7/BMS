Book Management System - Backend
This is the backend for the Book Management System, which provides a GraphQL API for managing books, authors, and reviews. It uses PostgreSQL (Sequelize) for structured data and MongoDB (Mongoose) for additional metadata storage.

🛠 Tech Stack
Node.js - JavaScript runtime
Express.js - Web framework
Apollo Server - GraphQL API
Sequelize (PostgreSQL) - ORM for relational data
Mongoose (MongoDB) - ODM for metadata storage
🚀 Setup & Installation
Clone the repository

git clone <repository-url>
cd BookManagementSystem
Install dependencies
npm install
Set up environment variables (.env)
npm run dev


📂 Project Structure
bash
Copy
Edit
BookManagementSystem/
│── src/
│   ├── config/            # Database connection files
│   ├── models/            # Sequelize & Mongoose models
│   ├── graphql/           # GraphQL schema & resolvers
│   ├── tests/             # Jest & Supertest test cases
│   ├── server.js          # Express & Apollo Server setup
│── package.json
│── README.md
│── .env
🔌 Database Configuration
PostgreSQL (Sequelize)

Stores books and authors
Relationships managed using Sequelize associations
MongoDB (Mongoose)

Stores book reviews and author metadata
📌 API Features
✅ Books & Authors

CRUD operations for books & authors
Pagination & filtering support
✅ Reviews

Store & retrieve user reviews for books
✅ GraphQL API

Queries for fetching books, authors & reviews
Mutations for creating/updating/deleting data
🧪 Running Tests
This project includes Jest + Supertest for API testing.

Run tests
npm test
Test cases covered:

Adding/updating/deleting books & authors
Fetching books & authors with filters
Handling edge cases (invalid IDs, missing fields)
📌 GraphQL API Examples
Query: Get Books with Reviews
query {
  books(limit: 10) {
    id
    title
    author { name }
    reviews { user rating review }
  }
}
Mutation: Add a New Book
graphql
Copy
Edit
mutation {
  addBook(title: "The Alchemist", description: "A novel about following your dreams", published_date: "1988-01-01", author_id: "5") {
    id title author { name }
  }
}
