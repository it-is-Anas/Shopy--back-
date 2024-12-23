//==================
    const User=  require('../Models/User');
    const Admin=  require('../Models/Admin');
    const mainAdmin = require('../config/main').mainAdmin;
//==================

exports.getUsers = async (req,res,next)=>{
    // const mainAdminId = await User.findAll({where: {first_name: 'main',last_name:'admin', email:'MainAdmin@shopy.com'}});
    // bydefault the main admin id is 1
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

