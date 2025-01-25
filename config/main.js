exports.appPort = 3000;

exports.sequelize = {
    name: 'shopy', 
    userName: 'root',
    password:'',
    dialect: 'mysql',
    host: 'localhost',
    port: 3306
};


exports.bycrypt = {
    saltyHash : 6,
};

exports.jwt = {
    secertKey: 'Shopy is an Eccommerce here',
    issuer: 'Shopy',
    expiresIn: '200h'
};


exports.mainAdmin = {
    // id: '1', bydefault
    first_name: 'main',
    last_name: 'admin',
    email: 'MainAdmin@shopy.com',
    password: '12345678',
    gender: 'male',
    birth_day: new Date().toISOString(),
};

exports.mainNots = [
    'Welcome To Shopy !',
    'Welcome Back to Shopy !',
    'The product has been added to the cart !',
    'The product has been removed from the cart !',
];