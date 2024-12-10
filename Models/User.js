const Sequelize = require('sequelize');
const sequelize = require('../config/Sequelize');

const User = sequelize.define('User',
    {
        first_name: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        last_name: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        email: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        password: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        img_url: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        gender: {
            allowNull: false,
            type: Sequelize.ENUM('male','female'),
        },
        birth_day: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    }
);

module.exports = User;