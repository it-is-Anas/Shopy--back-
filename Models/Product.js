const Sequelize = require('sequelize');
const sequelize = require('../config/Sequelize');


const product = sequelize.define('product',{
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    brand:{
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
    },
    desc:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    img_url:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    price:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    qty:{
        type: Sequelize.STRING,
        allowNull: false,
    },
});


module.exports = product;