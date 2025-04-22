const path = require('path');
const express = require('express');
const appPort = require('./config/main').appPort; 
const app = express();
const sequelize = require('./config/Sequelize');
const bodyParser = require('body-parser');
const multer = require('multer');
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



const auth = require('./Controllers/AuthController').auth;
const isAdmin = require('./Controllers/AuthController').isAdmin;
app.use(express.static(path.join(__dirname,'images')));



//authenticaction routes
app.use('/auth',authRoutes);


//user routes 
app.use(auth);


// Middleware to handle profile and product image uploads
app.use((req, res, next) => {
    const upload = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                if (file.fieldname === 'image') {
                    cb(null,'images/ProfileImgs')
                } else if (file.fieldname === 'productImg') {
                    cb(null,'images/productImgs')
                } else {
                    next(new Error('Invalid field name'),req,res,next);
                }
            },
            filename: (req, file, cb) => {
                cb(null, Math.random() * new Date().getMilliseconds()  + '-' +file.originalname);
            }
        }),
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                next(new Error('Only PNG, JPG, and JPEG are allowed'),req,res,next);
            }
        }
    }).fields([
        { name: 'image', maxCount: 1 },
        { name: 'productImg', maxCount: 1 }
    ]);
    // Call upload middleware and handle errors
    upload(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err.message);
        }
        next();
    });
});


app.use('/user',userRoutes);
app.use('/notfication',notficationRoutes);
app.use('/product',productRoutes);
app.use('/cart',cartRoutes);
app.use('/product-action',productCartRoutes);
app.use('/order',orderRoutes);
app.use('/favorate-product',FavorateProduct);

//admin routes
app.use(isAdmin);
app.use('/admin',adminRoutes);






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
        const startApp = new StartApp(1,1,1);
        await startApp.createMainAdmin();
        await startApp.createMainNots();
    })
    .then(()=>{
        const HOST = '0.0.0.0'; // Bind to all network interfaces
        app.listen(appPort, HOST, () => {
            console.log(`Server running at http://${HOST}:${appPort}/`);
        });
    }).catch(err=>{
        console.log('ERROR IN DB SEQUELIZE CONNECTION WITH SYNC');
    })
})
.catch(err=>{
    console.log('ERROR IN DB SEQUELIZE CONNECTION WITH AUTHENTICATE');
});