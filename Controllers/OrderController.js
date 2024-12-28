const Cart = require('../Models/Cart');
const Order = require('../Models/Order');
const { validationResult } = require('express-validator');
exports.create = async (req,res,next)=>{
    try{
        const carts = await Cart.findAll({where: {user_id: req.user.id}});
        if(!carts.length){
            return res.status(404).json({msg: 'the cart not found, you have to create a cart and buy items'})
        }
        const cartId = carts[carts.length - 1].id;
        const order = await Order.create({
            cart_id: cartId ,
            user_id: req.user.id
        });
        const cart = await Cart.create({user_id: req.user.id});
        res.status(201).json({msg:'You have been create a new Order',order,cart});
    }catch(err){
        // res.status(500).json({msg:'something went wrong'});
        next(err,req,res,next);
    }
};

exports.getall = async (req,res,next)=>{
    try{
        const carts = await Cart.findAll({where:{user_id: req.user.id}});
        const cartId = carts[carts.length - 1].id;
        const orders = await Order.findAll({where:{user_id: req.user.id}});
        res.json({msg:'All orders',cartId:cartId})
    }catch(err){
        next(err,req,res,next);
    }
};


exports.get = async (req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
        }
        const ord_id = req.params.ord_id;
        const order = await Order.findAll({where:{id: ord_id}});
        res.json({msg:'All orders',order: order[0]})
    }catch(err){
        next(err,req,res,next);
    }
};


exports.delete = async (req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
        }
        const ord_id = req.params.ord_id;
        const order = await Order.findAll({where:{id: ord_id}});
        const del = await order[0].destroy();
        res.json({msg:'the order has been deleted'})
    }catch(err){
        next(err,req,res,next);
    }
};

