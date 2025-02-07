const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();
const sequelize = require('./config/sequelize');
const connectMongoDB = require('./config/mongoose');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
require('./models/associations');

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });

    // Connect to databases
    await sequelize.sync();
    await connectMongoDB();

    app.listen(process.env.PORT || 4000, () => {
        console.log(`🚀 Server running at http://localhost:4000${server.graphqlPath}`);
    });
}

startServer();
