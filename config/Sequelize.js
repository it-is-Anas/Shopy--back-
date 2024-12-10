const Sequelize = require('sequelize');
const constants = require('../config/main').sequelize;

const sequelize = new Sequelize(constants.name,constants.userName,constants.password,{
    dialect: constants.dialect,
    host: constants.host,
    port: constants.port,
});


module.exports = sequelize;


