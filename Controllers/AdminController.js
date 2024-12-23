//==================
    const User=  require('../Models/User');
    const Admin=  require('../Models/Admin');
    const mainAdmin = require('../config/main').mainAdmin;
//==================

exports.getUser = async (req,res,next)=>{
    const id = req.params.userId;
    const mainAdminId = 1;
    const user = await User.findAll({where: {id: id}});
    if(!user.length){
        return res.status(404).json({msg: 'The user id not found'});
    }
    res.json({
        msg: 'The User:',
        user: user
    });
};
exports.getUsers = async (req,res,next)=>{
    const mainAdminId = 1;
    const users = await User.findAll();
    res.json({
        msg: 'The whole Users',
        users: users
    });
};

exports.blockUser = async (req,res,next)=>{
    const userId= req.params.userId;
    const user = await User.findAll({where:{id:userId}});
    if(!user.length){
        return res.status(404).json({msg: `the id ${userId} is not found`});
    }
    user[0].blocked = true;
    user[0].save();
    res.status(201).json({
        msg:`the user ${user[0].first_name} has been blocked`,
    });
};
exports.unBlockUser = async (req,res,next)=>{
    const userId= req.params.userId;
    const user = await User.findAll({where:{id:userId}});
    if(!user.length){
        return res.status(404).json({msg: `the id ${userId} is not found`});
    }
    user[0].blocked = false ;
    user[0].save();
    res.status(201).json({
        msg:`the user ${user[0].first_name} has been unblocked`,
    });
};

exports.createSubAdmin = async (req,res,next)=>{
    const userId = req.params.userId;
    const user = await User.findAll({where:{ id :userId}});
    if(!user.length){
        return res.status(404).json({msg: `the id ${userId} is not found`});
    }
    const checkIsAdmin = await Admin.findAll({where:{user_id: userId}});
    
    if(checkIsAdmin.length){
        return res.status(200).json({
            msg:`the user is already Appointed as subAdmin`,
        });
    }
    const subAdmin = await Admin.create({
        user_id: userId,
        admin_id: req.user.id,
    });
    res.status(201).json({
        msg:`the user ${user[0].first_name} has been Appointed as subAdmin`,
    });
};

exports.deleteSubAdmin = async (req,res,next)=>{
    const userId = req.params.userId;
    const user = await User.findAll({where:{ id :userId}});
    if(!user.length){
        return res.status(404).json({msg: `the id ${userId} is not found`});
    }
    const checkIsAdmin = await Admin.findAll({where:{user_id: userId}});
    if(!checkIsAdmin.length){
        return res.status(200).json({
            msg:`the user is not Appointed as subAdmin`,
        });
    }
    const subAdmin = await Admin.findAll({where:{user_id: userId}});
    if(user[0].email != mainAdmin.email){
        subAdmin[0].destroy();
    }
    return res.status(201).json({msg:`the user of id ${userId} is no long sub admin`})
};


exports.getAdmins = async (req,res,next)=>{
    const admins = await Admin.findAll();
    const users = await User.findAll();
    const resultAdmins = [];
    for(let i = 0 ; i < admins.length ;++i){
        for(let j = 0 ; j < users.length ; ++j){
            if(admins[i].user_id === users[j].id ){
                resultAdmins.push({...admins[i].dataValues , first_name: users[j].first_name , last_name: users[j].last_name, email: users[j].email , gender: users[j].gender , birth_day: users[j].birth_day});
            }
        }
    }
    res.json({
        msg: 'The whole Users',
        admins: resultAdmins
    });
};