const express = require('express');
const appPort = require('./config/main').appPort;
const app = express();
const sequelize = require('./config/Sequelize');



app.get('/',(req,res,next)=>{
    res.json('App is running ok');
});


sequelize.authenticate()
.then(()=>{
    app.listen(appPort);console.log('APP IS RUNNING ON URL: http://localhost:'+appPort+'/');
})
.catch(err=>console.log(err));