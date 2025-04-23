
const UserNotfication = require('../Models/UserNotfication');
const User = require('../Models/User');
const Notfication = require('../Models/Notfication');
const { validationResult } = require('express-validator');
const sequelize = require('../config/Sequelize');


exports.publishNotfications = async (req,res,next) => {
    const users = await User.findAll();
    const notfication = await Notfication.findAll();

    for(let i = 0 ; i < users.length ; ++i){
            UserNotfication.create({
                user_id: users[i].id,
                notfication_id: notfication[notfication.length-1].id,
            });
    }
    console.log(req.user);
    res.status(201).json({msg: 'Notifcation has been created successfully',not: {...notfication[notfication.length-1].dataValues,name: req.user.first_name + ' ' + req.user.last_name,img_url: req.user.img_url}  });
};



exports.myNotfications = async (req,res,next)=>{
    try{
        const userId = req.user.id;
        const userNotfications = await UserNotfication.findAll({where: {user_id: userId}});
        const resultNotfication = [];
        for(let i = 0 ; i < userNotfications.length ; i++ ){
            const nots = await Notfication.findAll({where:{id: userNotfications[i].notfication_id}});
            if(!nots.length){
                continue;
            }
            const not = nots[0];
            const obj  = {
                id:  userNotfications[i].id,
                content: not.content,
                createdAt: userNotfications[i].createdAt,
                updatedAt: userNotfications[i].updatedAt,
                seen: userNotfications[i].seen,
            };
            resultNotfication.push(obj);
        }
        res.json({msg:'Your notfications:',notfications: resultNotfication.reverse()});    
    }catch(err){
        next(err,req,res,next);
    };
};


exports.makeAsSeen = async  (req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
        }
        const notId = req.params.notId;
        const userNotfications = await UserNotfication.findAll({where: { id : notId  , user_id: req.user.id}});
        if(!userNotfications.length){
            return res.status(404).json({msg:'Notfication not found'});
        }
        const userNotfication = userNotfications[0];
        userNotfication.seen = true;
        userNotfication.save();
        res.json({msg:'You have make the Notfication'});
    }
    catch(err){
        next(err,req,res,next);
    };
};


exports.welcomeToNewUser = async (userId) => {
    try{
        const un = await UserNotfication.create({
            user_id: userId,
            notfication_id: 1,
        });
    }
    catch(err){       
        next(err,req,res,next);
    }
};

exports.welcomeToBackUser = async (userId) => {
    try{const un = await UserNotfication.create({
        user_id: userId,
        notfication_id: 2,
    });
    }
    catch(err){       
        next(err,req,res,next);
    }
};


exports.addedToCart = async (userId) => {
    try{
    const un = await UserNotfication.create({
        user_id: userId,
        notfication_id: 3,
    });
    }catch(err){       
        next(err,req,res,next);
    }
};


exports.removedFromCart = async (userId) => {
    try{const un = await UserNotfication.create({
        user_id: userId,
        notfication_id: 4,
    });}
    catch(err){       
        next(err,req,res,next);
    }
};