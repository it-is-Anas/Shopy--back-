const express = require('express');
const appPort = require('./config/main').appPort;
const app = express();
const sequelize = require('./config/Sequelize');
const bodyParser = require('body-parser');


const authRoutes = require('./Routes/Auth');



app.use(bodyParser.json());


app.use('/auth',authRoutes);



sequelize.authenticate()
.then(()=>{
    // sequelize.sync({force: true})
    sequelize.sync()
    .then(()=>{
        app.listen(appPort);console.log('APP IS RUNNING ON URL: http://localhost:'+appPort+'/');
    }).catch(err=>{
        console.log('ERROR IN DB SEQUELIZE CONNECTION WITH SYNC');
    })
})
.catch(err=>{
    console.log('ERROR IN DB SEQUELIZE CONNECTION WITH AUTHENTICATE');
});