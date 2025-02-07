const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './.env' });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT || 5432,
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
);



// Test the connection
sequelize.authenticate()
    .then(() => console.log('✅ Database connected successfully!'))
    .catch(err => console.error('❌ Database connection failed:', err));

module.exports = sequelize;
