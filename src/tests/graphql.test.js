const request = require("supertest");
const { httpServerPromise } = require("../server");
const sequelize = require("../config/sequelize");
const mongoose = require("mongoose");
let httpServer;

jest.setTimeout(20000);

beforeAll(async () => {
    httpServer = await httpServerPromise;
});

afterAll(async () => {
    if (httpServer) {
        await httpServer.close();
    }
    await sequelize.close();
    await mongoose.connection.close();
})
const GRAPHQL_ENDPOINT = "/graphql";

describe("GraphQL API Tests", () => {
    let createdAuthorId;
    let createdBookId;
    let createdReviewId;

    it("should add an author", async () => {
        const response = await request(httpServer)
            .post(GRAPHQL_ENDPOINT)
            .send({
                query: `
          mutation {
            addAuthor(name: "Test Author", biography: "Test author biography", born_date: "1890-09-15") {
              id
              name
              biography
              born_date
            }
          }
        `,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.addAuthor).toHaveProperty("id");
        createdAuthorId = response.body.data.addAuthor.id;
    });

    it("should add a book", async () => {
        const response = await request(httpServer)
            .post(GRAPHQL_ENDPOINT)
            .send({
                query: `
          mutation {
            addBook(title: "Test book", description: "Test book description", published_date: "1939-11-06", author_id: "${createdAuthorId}") {
              id
              title
              description
              published_date
              author { id name }
            }
          }
        `,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.addBook).toHaveProperty("id");
        createdBookId = response.body.data.addBook.id;
    });

    it("should fetch a book by ID", async () => {
        const response = await request(httpServer)
            .post(GRAPHQL_ENDPOINT)
            .send({
                query: `query { book(id: "${createdBookId}") { id title description published_date author { id name } reviews { id user rating review review_date } } } `,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.book.id).toBe(createdBookId);
    });

    it("should fetch an author by ID", async () => {
        const response = await request(httpServer)
            .post(GRAPHQL_ENDPOINT)
            .send({
                query: `query { author(id: "${createdAuthorId}") { id name biography born_date books { id title } } } `,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.author.id).toBe(createdAuthorId);
    });

    it("should update an author", async () => {
        const response = await request(httpServer)
            .post(GRAPHQL_ENDPOINT)
            .send({
                query: `mutation { updateAuthor(id: "${createdAuthorId}", biography: "Updated biography for Agatha Christie.") { id name biography } } `,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.updateAuthor.biography).toBe("Updated biography for Agatha Christie.");
    });

    it("should update a book", async () => {
        const response = await request(httpServer)
            .post(GRAPHQL_ENDPOINT)
            .send({
                query: `mutation { updateBook(id: "${createdBookId}", title: "Pride and Prejudice (Updated)", description: "Updated description for Pride and Prejudice.") { id title description } } `,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.updateBook.title).toBe("Pride and Prejudice (Updated)");
    });

    it("should delete a book", async () => {
        const response = await request(httpServer)
            .post(GRAPHQL_ENDPOINT)
            .send({
                query: `mutation { deleteBook(id: "${createdBookId}") } `,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.deleteBook).toBe("Book deleted successfully");
    });

    it("should delete an author", async () => {
        const response = await request(httpServer)
            .post(GRAPHQL_ENDPOINT)
            .send({
                query: `mutation { deleteAuthor(id: "${createdAuthorId}") } `,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.deleteAuthor).toBe("Author deleted successfully");
    });

    it("should add a review", async () => {
        const response = await request(httpServer)
            .post(GRAPHQL_ENDPOINT)
            .send({
                query: `mutation { addReview(book_id: "1", user: "John Doe", rating: 5, review: "An amazing book!") { id book_id user rating review review_date } } `,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.addReview).toHaveProperty("id");
        createdReviewId = response.body.data.addReview.id;
    });
});
