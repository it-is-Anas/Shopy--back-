const Sequelize = require('sequelize');
const sequelize = require('../config/Sequelize');

const Notfication = sequelize.define('Notfication',{
    content:{
        type: Sequelize.STRING,
    },
});


module.exports = Notfication;