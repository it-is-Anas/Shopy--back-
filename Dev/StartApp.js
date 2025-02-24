//===================
const User = require('../Models/User');
const Admin = require('../Models/Admin');
const bcrypt = require('bcrypt');
const saltyHash = require('../config/main').bycrypt.saltyHash;
const mainAdmin = require('../config/main').mainAdmin;
//===================
const mainNots = require('../config/main').mainNots;
const Notficaiton = require('../Models/Notfication');
//===================
const fs = require('fs');
const path = require('path');
//===================



class StartApp{
    constructor(mainAdmin=null,mainNots=null,checkImgFolder=false){
        this.mainAdmin = mainAdmin;
        this.mainNots = mainNots;

        if(checkImgFolder){
            // Define directories
            const profileImgDir = path.join(__dirname, '../images/ProfileImgs');
            const productImgDir = path.join(__dirname, '../images/productImgs');
            // Ensure directories exist
            this.ensureDirExists(profileImgDir);
            this.ensureDirExists(productImgDir);
        }

    }
    createMainAdmin(){
        if(this.mainAdmin){
            const promise = new Promise( async (res,rej)=>{
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
        }
    }
    
    async createMainNots(){
        if(this.mainNots){
            try{
                const check = await Notficaiton.findAll({where:{id:1 ,content: mainNots[0] }});
                const users = await User.findAll({where:{email: mainAdmin.email}});
                const user_id= users[0].id;
                const admins = await Admin.findAll({where:{user_id:user_id}});
                const admin_id =admins[0].id;
                if(!check.length){
                    mainNots.forEach(async not=>{
                        const newNot = await Notficaiton.create({
                            content: not ,
                            admin_id: admin_id,
                        });
                    });
                }
            }catch(err){
                next(err,req,res,next);
            }
        }
    }
    ensureDirExists (dir){
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    };

}

module.exports  = StartApp;