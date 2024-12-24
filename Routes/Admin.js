//============
const express = require('express');
const routes = express.Router();
const AdminController = require('../Controllers/AdminController');
const { body  } = require('express-validator');
const { param } = require('express-validator');
//============
const NotficationController = require('../Controllers/NotficationController'); 
//============
//============
// users routes
routes.get('/get-user/:userId', AdminController.getUser);
routes.get('/get-users', AdminController.getUsers);
routes.get('/get-admins', AdminController.getAdmins);
routes.patch('/block-user/:userId',AdminController.blockUser);
routes.patch('/un-block-user/:userId',AdminController.unBlockUser);
routes.patch('/create-sub-admin/:userId',AdminController.createSubAdmin);
routes.patch('/delete-sub-admin/:userId',AdminController.deleteSubAdmin);

//notfication
routes.post('/notfication/create',[
    body('content','content should be a string at least 3 chars')
    .isString()
    .isLength({min:3})
],NotficationController.create);

routes.get('/notfication/get-all-notfication',NotficationController.get);
routes.get('/notfication/get-my-notfication',NotficationController.getMine);

routes.put('/notfication/update/:notId',[
    body('content','content should be a string at least 3 chars')
    .isString()
    .isLength({min:3})
],NotficationController.update);

routes.delete('/notfication/delete/:notId',
    [
        param('notId','sdfghjk')
        // continue not id validation in delete and update
    ]
    ,NotficationController.delete);


module.exports = routes;