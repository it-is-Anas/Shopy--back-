const express = require('express');
const routes = express.Router();
const CartController = require('../Controllers/CartController');
const { param } = require('express-validator');
routes.post('/create',CartController.create);
routes.get('/get',CartController.get);
routes.get('/get-all',CartController.getAll);
routes.delete('/delete/:cart_id',[param('cart_id','cart_id should be a number "integer"').isNumeric().isInt()],CartController.delete);
routes.put('/clear-cart',CartController.clearCart);

module.exports = routes;