const express = require('express');
const routes = express.Router();
const { body } = require('express-validator');
const { param } = require('express-validator');
const ProductController = require('../Controllers/ProductController');

// ==========
    

routes.post('/create',[
    body('name','name should be string and at least 3 chars and less than 255')
    .isString()
    .isLength({min:3,max: 255}),
    body('desc','desc should be string and at least 0 chars and less than 500')
    .isString()
    .isLength({max: 500}),
    body('price','price should be number "float" ')
    .isNumeric()
    .isFloat(),
    body('qty','qty should be number "integer"')
    .isNumeric()
    .isInt()
],ProductController.createProduct);


routes.get('/get-all-of-mine', ProductController.getAllOfMyProducts);

routes.put('/update/:prod_id',[
    body('name','name should be string and at least 3 chars and less than 255')
    .isString()
    .isLength({min:3,max: 255}),
    body('desc','desc should be string and at least 0 chars and less than 500')
    .isString()
    .isLength({max: 500}),
    body('price','price should be number "float" ')
    .isNumeric()
    .isFloat(),
    body('qty','qty should be number "integer"')
    .isNumeric()
    .isInt()
],[
    param('prod_id','prod_id should be a number "integer" ')
    .isNumeric()
    .isInt()
], ProductController.updateProduct);

routes.delete('/delete/:prod_id',[
    param('prod_id','prod_id should be a number "integer" ')
    .isNumeric()
    .isInt()
], ProductController.deleteProduct);


module.exports = routes;