const User = require('../Models/User');
const { validationResult } = require('express-validator');
const sequelize = require('../config/Sequelize');

exports.profile = async (req,res,next)=>{
    const [checkAdmin] = await sequelize.query(`SELECT * FROM admins WHERE user_id = ${req.user.id}`);
    res.json({
        msg:`It's ${req.user.first_name}'s profile`,
        id: req.user.id,
        img_url: req.user.img_url,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        gender: req.user.gender,
        verified: req.user.verified,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
        birth_day: req.user.birth_day,
        blocked:  req.user.blocked,
        isAdmin: checkAdmin.length,
    });
};

exports.update = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    User.findAll({where: {id: req.user.id,email:req.user.email}})
    .then(users=>{
            return users[0];
    })
    .then(user=>{
        const {first_name , last_name  } = req.body;
        user.first_name = first_name;
        user.last_name = last_name;
        user.save();
        res.status(201).json({msg: 'USER ACCOUNT UPDATED SUCCESSFULL: ',user});
    }).catch(err=>{
        next(err,req,res,next);
    })
};


exports.uploadProfilePictuer = (req,res,next)=>{
    const img = req.files['image'] ? req.files['image'][0] : null;
    if(!img){
        res.status(422).json({msg:'ATTECHED FIELE SHOULD BE AN IMAGE'});
    }else{
        User.findAll({where:{id: req.user.id}})
        .then(users=>{
            return users[0];
        }).then(user=>{
            user.img_url = '/' + img.path.slice(7,img.length);
            user.save();
            res.json({msg:'USER PICTUER SUCCESSFUL UPDATED',user});
        }).catch(err=>{
            next(err,req,res,next);
        })
    }
};


exports.destry = (req,res,next)=>{
    User.findAll({where:{id: req.user.id}})
    .then(users=>{return users[0]})
    .then(user=>{ user.destroy(); res.json({msg: 'THE ACCOUNT HAS BEEN DELETED'})})
    .catch(err=>{ next(err,req,res,next); });
};


exports.getMySalles =  async (req,res,next)=>{
    const id = req.user.id;
    // const [_,result] = await sequelize.query(`SELECT p.id AS product_id, p.name,p.price,p.brand,p.desc ,pc.id  , pc.qty , pc.createdAt , pc.updatedAt , pc.product_id , pc.cart_id FROM products as p LEFT JOIN product_carts AS pc ON p.id = pc.product_id where p.user_id = ${id} ORDER BY pc.id DESC;`);
    const [_, result] = await sequelize.query(` SELECT p.id AS product_id, p.name, p.price, p.brand, p.desc, pc.id, pc.qty, pc.createdAt, pc.updatedAt, pc.product_id, pc.cart_id FROM products AS p INNER JOIN product_carts AS pc ON p.id = pc.product_id WHERE p.user_id = ${id} ORDER BY pc.id DESC; `);
    res.json({
        msg:'Your Salles',
        data: result,
    })
};