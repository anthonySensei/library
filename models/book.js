const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const Book = sequelize.define('book_', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    isbn: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: 'Please fill in isbn' }
        },
        unique: {
            args: true,
            msg: 'ISBN must be unique'
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: 'Please fill in book name' }
        }
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: 'PLease fill in book author' }
        }
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: 'Please fill in book genre' }
        }
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: 'Please fill in book year' }
        }
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: 'You should enter book description' }
        }
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Book;
