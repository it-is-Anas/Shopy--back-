const express = require('express');
const routes = express.Router();
const OrderController = require('../Controllers/OrderController');
const { param } = require('express-validator');
routes.post('/create',OrderController.create);
routes.get('/get-all',OrderController.getall);
routes.get('/get/:ord_id',[
    param('ord_id','ord_id should be number "integer"').isNumeric().isInt(),
],OrderController.get);
routes.delete('/delete/:ord_id',[
    param('ord_id','ord_id should be number "integer"').isNumeric().isInt(),
],OrderController.delete);


module.exports = routes;