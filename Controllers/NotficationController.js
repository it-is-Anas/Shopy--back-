const { validationResult } = require('express-validator');
const Notfication = require('../Models/Notfication');
const sequelize =  require('../config/Sequelize');

exports.create = async (req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
        }
        const {content} = req.body;
        const notfication = await Notfication.create({ content: content , admin_id: req.user.id}); 
        next();
    }catch(err){
        next(err,req,res,next);
    };
    // res.status(201).json({msg: 'Notifcation has been created successfully'});
};

exports.get = async (req,res,next)=>{
    try{
        const [notfication] = await sequelize.query('SELECT noti.id as id ,noti.content as content ,noti.createdAt as createdAt , user.first_name ,user.last_name  , user.img_url  FROM notfications AS noti  JOIN admins As admin ON noti.admin_id = admin.id JOIN users AS user ON admin.user_id = user.id; ')
        res.json({msg: 'The notfication:' , notfication})    
    }catch(err){
        next(err,req,res,next);
    };
};
exports.getMine = async (req,res,next)=>{
    try{
        const notfication = await Notfication.findAll({where: {admin_id: req.user.id}});
        res.json({msg: 'The notfication:' , notfication});    
    }catch(err){
        next(err,req,res,next);
    };
};

exports.update = async (req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
        }
        const { notId } = req.params;
        const notfications = await Notfication.findAll({where: {id: notId}});
        if(!notfications.length){
            return res.status.json({msg:'Notfication not found'});
        }
        const { content } = req.body;
        const notfication = notfications[0];
        notfication.content = content;
        notfication.save();
        res.status(201).json({msg:'The notfication has been updated'});
    }catch(err){
        next(err,req,res,next);
    };
};

exports.delete = async (req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
        }
        const { notId } = req.params;
        const notfications = await Notfication.findAll({where: {id: notId}});
        if(!notfications.length){
            return res.status(404).json({msg: 'The Notfication has been delted'});
        }
        const deleteNotfication = await notfications[0].destroy();
        res.status(201).json({msg: 'The Notfication has been deleted'});    
    }catch(err){
        next(err,req,res,next);
    };
};