const express = require('express');
const appPort = require('./config/main').appPort;
const app = express();




app.get('/',(req,res,next)=>{
    res.json('App is running ok');
});
app.listen(appPort);console.log('APP IS RUNNING ON URL: http://localhost:'+appPort+'/');