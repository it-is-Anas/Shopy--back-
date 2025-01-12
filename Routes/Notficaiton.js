const express = require('express');

const routes = express.Router();
const { param } = require('express-validator');

const UserNotficationController = require('../Controllers/UserNotficationController');

routes.get('/get',UserNotficationController.myNotfications);

routes.patch('/see-notfication/:notId',
    [
        param('notId','notId is required filed and it should be an integer')
        .isNumeric()
    ]
    ,UserNotficationController.makeAsSeen);


module.exports = routes;
