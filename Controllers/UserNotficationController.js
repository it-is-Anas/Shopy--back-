
const UserNotfication = require('../Models/UserNotfication');
const User = require('../Models/User');
const Notfication = require('../Models/Norfication');
const { validationResult } = require('express-validator');
exports.publishNotfications = async (req,res,next) => {
    const users = await User.findAll();
    const notfication = await Notfication.findAll();

    for(let i = 0 ; i < users.length ; ++i){
            UserNotfication.create({
                user_id: users[i].id,
                notfication_id: notfication[notfication.length-1].id,
            });
    }
    res.status(201).json({msg: 'Notifcation has been created successfully'});
};



exports.myNotfications = async (req,res,next)=>{
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
            id: not.id,
            content: not.content,
            createdAt: not.createdAt,
            updatedAt: not.updatedAt,
            seen: userNotfications[i].seen,
        };
        resultNotfication.push(obj);
    }
    res.json({msg:'Your notfications:',notfications:resultNotfication})
};


exports.makeAsSeen = async  (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    const notId = req.params.notId;
    const userNotfications = await UserNotfication.findAll({where: {notfication_id: notId  , user_id: req.user.id}});
    if(!userNotfications.length){
        return res.status(404).json({msg:'Notfication not found'});
    }
    const userNotfication = userNotfications[0];
    userNotfication.seen = true;
    userNotfication.save();
    res.json({msg:'You have make the Notfication'});
};