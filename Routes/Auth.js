const express = require('express');
const routes = express.Router();

const { body } = require('express-validator');


const authController = require('../Controllers/AuthController');


routes.post('/sign-up',
    [
        body('first_name','first name filed has to be between 3 to 255 chars')
        .isLength({min:3 , max: 255}),
        body('last_name','last name filed has to be  between 3 to 255 chars')
        .isLength({min:3 , max: 255}),
        body('email','email is required filed has to be at least 5 ')
        .isEmail(),
        body('password','password filed is required has to be nimuric and at least 8')
        .isLength({min: 8 , max: 255})
        .isNumeric(),
        body('gender','gender filed has to be male or female')
        .isIn(['male', 'female']),
        body('birth_day','birth day is required')
    ]
    ,authController.signUp);

routes.post('/log-in',
    [
        body('email','email is required filed has to be at least 5 ')
        .isEmail(),
        body('password','password filed is required has to be nimuric and at least 8 ')
        .isLength({min: 8 , max: 255})
        .isNumeric(),
    ],
    authController.logIn
);



module.exports = routes;