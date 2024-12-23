const User = require('../Models/User');
const Admin = require('../Models/Admin');
const bcrypt = require('bcrypt');
const saltyHash = require('../config/main').bycrypt.saltyHash;
const mainAdmin = require('../config/main').mainAdmin;


const startApp = new Promise( async (res,rej)=>{
    try{
        const checkUser = await User.findAll({ where:{ email: mainAdmin.email , first_name:mainAdmin.first_name }});
        if(!checkUser.length){
            const hashedPasswrod = await bcrypt.hash(mainAdmin.password,saltyHash);
            const user = await User.create({
                'first_name': mainAdmin.first_name,
                'last_name': mainAdmin.last_name,
                'email': mainAdmin.email,
                'gender':mainAdmin.gender,
                'birth_day': mainAdmin.birth_day,
                'password': hashedPasswrod,
            });
            const admin = await Admin.create({
                user_id : user.id,
                admin_id : user.id,
            });
        }
        res('OK');
    }
    catch(err){
        rej(err);
        console.log('err not exsocnsk');
    }
});

module.exports = startApp;