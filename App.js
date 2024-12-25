const path = require('path');
const express = require('express');
const appPort = require('./config/main').appPort;
const app = express();
const sequelize = require('./config/Sequelize');
const bodyParser = require('body-parser');
const multer = require('multer');
const profileImgDisk = require('./config/File').profileImgDisk;
const startApp = require('./Dev/StartApp');

const authRoutes = require('./Routes/Auth');
const userRoutes = require('./Routes/User');
const adminRoutes = require('./Routes/Admin');
const notficationRoutes = require('./Routes/Notficaiton');
const productRoutes = require('./Routes/Product');

app.use(bodyParser.json());
const auth = require('./Controllers/AuthController').auth;
const isAdmin = require('./Controllers/AuthController').isAdmin;
app.use(express.static(path.join(__dirname,'images')));


//authenticaction routes
app.use('/auth',authRoutes);

//user routes 
app.use(auth);
app.use(multer({storage: profileImgDisk.fileStorage , fileFilter: profileImgDisk.fileFilter}).single('image'));
app.use('/user',userRoutes);
app.use('/notfication',notficationRoutes);
app.use('/product',productRoutes);



//admin routes
app.use(isAdmin);
app.use('/admin',adminRoutes);



//error handling  I have to add


//not found route 
app.use((req,res,next)=>{
    res.status(404).json({msg:'Route not found'});
})


sequelize.authenticate()
.then(()=>{
    // sequelize.sync({force: true})
    sequelize.sync()
    .then(_=>{
        return startApp;
    })
    .then(()=>{
        app.listen(appPort);console.log('APP IS RUNNING ON URL: http://localhost:'+appPort+'/');
    }).catch(err=>{
        console.log('ERROR IN DB SEQUELIZE CONNECTION WITH SYNC');
    })
})
.catch(err=>{
    console.log('ERROR IN DB SEQUELIZE CONNECTION WITH AUTHENTICATE');
});