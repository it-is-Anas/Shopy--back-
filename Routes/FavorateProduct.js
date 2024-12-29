const express = require('express');
const routes = express.Router();
const { param } = require('express-validator');
const FavorateProductController = require('../Controllers/FavorateProductController');

routes.get('/get',FavorateProductController.get);

routes.post('/create/:prod_id',[
    param('prod_id','prod_id should be number (int)')
    .isNumeric()
    .isInt()
],FavorateProductController.create);

routes.delete('/delete/:fav_id',[
    param('fav_id','fav_id should be number (int)')
    .isNumeric()
    .isInt()
],FavorateProductController.delete);



module.exports = routes;
