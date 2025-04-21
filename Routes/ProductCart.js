const express = require('express');
const routes = express.Router();
const ProductCartController = require('../Controllers/ProductCartController');
const { param } = require('express-validator');
const { body } = require('express-validator');


routes.get('/get',ProductCartController.get);

routes.post('/create',[
    // param('prod_id','prod_id should be number "int"')
    // .isNumeric()
    // .isInt()
],[ 
    body('qty','qty should be a number "int"')
    .isNumeric()
    .isInt(),
    body('prod_id','prod_id should be number "int"')
    .isNumeric()
    .isInt()
],ProductCartController.create);

routes.post('/update/:prod_cart_id',[
    param('prod_cart_id','prod_id should be number "int"')
    .isNumeric()
    .isInt()
],[
    body('qty','qty should be a number "int"')
    .isNumeric()
    .isInt(),
    body('prod_id','prod_id should be number "int"')
    .isNumeric()
    .isInt()
],ProductCartController.update);

routes.delete('/delete/:prod_cart_id',[
    param('prod_cart_id','prod_id should be number "int"')
    .isNumeric()
    .isInt()
],ProductCartController.delete);

routes.put('/add-one/:prod_id',[
    param('prod_id','prod_id is mandatory')
    .isNumeric()
    .isInt(),
],ProductCartController.addOneProduct);
routes.put('/minus-one/:prod_id',[
    param('prod_id','prod_id is mandatory')
    .isNumeric()
    .isInt(),
],ProductCartController.removeOneProduct);

module.exports = routes;