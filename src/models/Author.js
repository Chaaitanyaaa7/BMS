const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Author = sequelize.define('Author', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    biography: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    born_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'authors',
    timestamps: true,
});
module.exports = Author;
