const path = require('path');
const express = require('express');
const appPort = require('./config/main').appPort;
const app = express();
const sequelize = require('./config/Sequelize');
const bodyParser = require('body-parser');
const multer = require('multer');
const profileImgDisk = require('./config/File').profileImgDisk;
const StartApp = require('./Dev/StartApp');

const authRoutes = require('./Routes/Auth');
const userRoutes = require('./Routes/User');
const adminRoutes = require('./Routes/Admin');
const notficationRoutes = require('./Routes/Notficaiton');
const productRoutes = require('./Routes/Product');
const cartRoutes = require('./Routes/Cart');
const productCartRoutes = require('./Routes/ProductCart');
const orderRoutes = require('./Routes/Order');
const FavorateProduct = require('./Routes/FavorateProduct');
const cors = require('cors');


app.use(bodyParser.json());

//CORS 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Respond OK to preflight requests
    }

    next();
});

app.use(cors({
    origin: 'http://localhost:8080', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin','*');
//     res.setHeader('Access-Control-Allow-Methods','GET, POST, DELETE, PATCH, PUT');
//     res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
//     next();
// });


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
app.use('/npm',productRoutes);
app.use('/cart',cartRoutes);
app.use('/product-action',productCartRoutes);
app.use('/order',orderRoutes);
app.use('/favorate-product',FavorateProduct);
//admin routes
app.use(isAdmin);
app.use('/admin',adminRoutes);



//not found route 
app.use((req,res,next)=>{
    res.status(404).json({msg:'Route not found'});
})


//error handling  I have to add
app.use((error,req,res,next)=>{
    const msg = error.msg || 'Somthing went wrong';
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({msg:msg});
});



sequelize.authenticate()
.then(()=>{
    // sequelize.sync({force: true})
    sequelize.sync()
    .then(async _=>{
        const startApp = new StartApp(1,1);
        await startApp.createMainAdmin();
        await startApp.createMainNots();
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