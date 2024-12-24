//============
const express = require('express');
const routes = express.Router();
const AdminController = require('../Controllers/AdminController');
const { body  } = require('express-validator');
const { param } = require('express-validator');

//============
const NotficationController = require('../Controllers/NotficationController'); 
const UserNotficationCotroller = require('../Controllers/UserNotficationController');
//============
//============
// users routes
routes.get('/get-user/:userId', AdminController.getUser);
routes.get('/get-users', AdminController.getUsers);
routes.get('/get-admins', AdminController.getAdmins);
routes.patch('/block-user/:userId', [
    param('userId','userId is required filed and it should be an integer')
    .isNumeric()
],AdminController.blockUser);
routes.patch('/un-block-user/:userId', [
    param('userId','userId is required filed and it should be an integer')
    .isNumeric()
],AdminController.unBlockUser);
routes.patch('/create-sub-admin/:userId', [
    param('userId','userId is required filed and it should be an integer')
    .isNumeric()
],AdminController.createSubAdmin);
routes.patch('/delete-sub-admin/:userId', [
    param('userId','userId is required filed and it should be an integer')
    .isNumeric()
],AdminController.deleteSubAdmin);

//notfication
routes.post('/notfication/create',[
    body('content','content should be a string at least 3 chars')
    .isString()
    .isLength({min:3})
],NotficationController.create,UserNotficationCotroller.publishNotfications);

routes.get('/notfication/get-all-notfication',NotficationController.get);
routes.get('/notfication/get-my-notfication',NotficationController.getMine);

routes.put('/notfication/update/:notId',[
    body('content','content should be a string at least 3 chars')
    .isString()
    .isLength({min:3}),
],[
    param('notId','notId is required filed and it should be an integer')
    .isNumeric()
],NotficationController.update);

routes.delete('/notfication/delete/:notId',
    [
        param('notId','notId is required filed and it should be an integer')
        .isNumeric()
    ]
    ,NotficationController.delete);


module.exports = routes;