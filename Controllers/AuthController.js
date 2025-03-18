const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const bycryptConstant = require('../config/main').bycrypt;
const User = require('../Models/User');
const Admin = require('../Models/Admin');
const jwtConstant = require('../config/main').jwt;
const CartController = require('../Controllers/CartController');
const UserNotficationController = require('../Controllers/UserNotficationController');

exports.signUp = (req,res,next)=>{
    // res.status(201).json({msg:'OKL'});
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    const {first_name , last_name , email , gender , birth_day , password} = req.body;
    User.findAll({where: {email: email}})
    .then(users=>{
        if(users.length){
            res.status(422).json({msg: 'This email is already exisit'});
        }else{
            bcrypt.hash(password , bycryptConstant.saltyHash)
            .then((hashedPasswrod)=>{
                return User.create({
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email,
                    'gender': gender,
                    'birth_day': birth_day,
                    'password': hashedPasswrod,
                });
            })
            .then( user =>{
                const token = jwt.sign({id : user.id, email: user.email},jwtConstant.secertKey,
                    {
                        expiresIn: jwtConstant.expiresIn, // Token valid for 1 hour
                        issuer: jwtConstant.issuer,
                    }
                );
                CartController.cartForUser(user.id)
                .then(cart=>{
                    UserNotficationController.welcomeToNewUser(user.id)
                    .then(()=>{
                        res.status(201).json({
                            msg: 'welcome ',
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            grender: user.grender,
                            birth_day: user.birth_day,
                            token: token,
                            cart,
                        });
                    })
                })
                .catch(err=>{
                    next(err,req,res,next);
                });
                
            })
            .catch(err=>{
                console.log(err);
            });        
        }
    })
    .catch(err=>console.log(err));
};



exports.logIn = (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    const { email , password } = req.body;
    User.findAll({where: {email: email}})
    .then(users=>{
        if(users.length){
            const user = users[0];
            bcrypt.compare(password,user.password)
            .then(match=>{
                if(match){
                    const token = jwt.sign({id : user.id, email: user.email},jwtConstant.secertKey,
                        {
                            expiresIn: jwtConstant.expiresIn, // Token valid for 1 hour
                            issuer: jwtConstant.issuer,
                        }
                    );
                    UserNotficationController.welcomeToBackUser(user.id)
                    .then(()=>{
                        res.status(201).json({
                            msg: 'welcome back:',
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            grender: user.grender,
                            birth_day: user.birth_day,
                            token: token,
                        });
                    }).catch(err=>{next(err,req,res,next)});
                }else{
                    res.status(422).json({msg: 'email or password no match !'});
                }
            })
            .catch(err=>{
                console.log(err);
            });
        }else{
            res.status(422).json({msg: 'email or password no match'});
        }
    })
    .catch(err=>{
        console.log(err);
    });
};



exports.auth = (req,res,next)=>{
    if(req.get('Authorization')){
        let token = req.get('Authorization');
        token = token.split(' ')[1];
        let decoded;
        try{
            decoded = jwt.verify(token,jwtConstant.secertKey);
        }catch(err){    
            res.status(421).json({msg: 'NOT AUTHORIZED , PLEASE LOG IN AGIAN'});
            return;
        }
        User.findAll({where: {id: decoded.id ,email: decoded.email}, })//where:{email: decoded.email}
        .then((users)=>{
            if(users[0].blocked){
                return res.status(403).json({msg: 'This account has been blocked'});
            }
            req.user = users[0];
            next();
        })
        .catch(err=>{
            console.log(err);
            res.status(421).json({msg: 'NOT AUTHORIZED , PLEASE LOG IN AGIAN'});
        });
    }else{
        res.status(421).json({msg: 'NOT AUTHORIZED , PLEASE LOG IN AGIAN'});
    }
};


exports.isAdmin = async (req,res,next)=>{
    const checkAdmin = await Admin.findAll({where:{user_id: req.user.id}});
    if(checkAdmin.length){
        return next();
    }
    res.status(403).json({msg:'route not found 404'});
};