const Sequelize = require('sequelize');
const sequelize = require('../config/Sequelize');

const userNotfication = sequelize.define('user_notfication',{
    seen:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
});

module.exports = userNotfication;