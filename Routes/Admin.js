const express = require('express');
const routes = express.Router();
const AdminController = require('../Controllers/AdminController');
const { param } = require('express-validator');
routes.get('/get-users', AdminController.getUsers);

routes.patch('/block-user/:userId',AdminController.blockUser);
routes.patch('/un-block-user/:userId',AdminController.unBlockUser);
routes.patch('/create-sub-admin/:userId',AdminController.createSubAdmin);
routes.patch('/delete-sub-admin/:userId',AdminController.deleteSubAdmin);

module.exports = routes;