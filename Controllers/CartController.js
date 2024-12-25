const Cart = require('../Models/Cart');
const { validationResult } = require('express-validator');

exports.create = async (req,res,next)=>{
    try{
        const cart = await Cart.create({user_id: req.user.id});
        res.status(201).json({msg:'You have been create a new Cart'});
    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Something went wrong'});
    };
};

exports.get = async (req,res,next)=>{
    try{
        const carts = await Cart.findAll({where:{user_id: req.user.id}});
        if(!carts.length){
            res.status(404).json({msg:'You don`t have a Cart please create a new one'});
        }
        res.status(200).json({msg:'Your Cart',cart: carts[carts.length - 1]});
    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Something went wrong'});
    };
};

exports.getAll = async (req,res,next)=>{
    try{
        const carts = await Cart.findAll({where:{user_id: req.user.id}});
        if(!carts.length){
            res.status(404).json({msg:'You don`t have a Cart please create a new one'});
        }
        res.status(200).json({msg:'Your Cart',carts: carts });
    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Something went wrong'});
    };
}; 
exports.delete = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    const cart_id = req.params.cart_id;
    try{
        const carts = await Cart.findAll({where:{user_id: req.user.id , id: cart_id}});
        if(!carts.length){
            res.status(404).json({msg:'Your Cart has been deleted'});
        }
        const deleted = await carts[0].destroy();
        res.status(200).json({msg:'Your Cart has been deleted'});
    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Something went wrong'});
    };
};
