const ProductCart = require('../Models/productCart');
const Cart = require('../Models/Cart');
const {validationResult} = require('express-validator');


exports.create = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    try{
        const carts = await Cart.findAll({where:{user_id: req.user.id}});
        const cart_id = carts[carts.length-1].id;// 1
        const product_id = req.body.prod_id;//2
        // const product_id = req.params.prod_id;//2
        const qty = req.body.qty;//3
        const productCart = await ProductCart.create({
            qty,
            cart_id,
            product_id,
        });
        res.status(201).json({msg: 'The product cart has been created',productCart});
    }catch(err){
        next(err,req,res,next);
    };
};

exports.update = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    try{
        const prod_cart_id = req.params.prod_cart_id;
        const { qty , prod_id } = req.body;
        const carts = await Cart.findAll({where:{user_id: req.user.id}});
        const cart_id = carts[carts.length - 1].id;
        const prodCarts = await ProductCart.findAll({where:{id : prod_cart_id , cart_id:cart_id}});
        if(!prodCarts.length){
            res.status(404).json({msg: 'The product cart not found'});
        }
        prodCarts[0].qty = qty;
        prodCarts[0].product_id = prod_id;
        const save = await prodCarts[0].save();
        res.status(201).json({msg: 'The product cart has been updated',productCart: prodCarts[0]});
    }catch(err){
        next(err,req,res,next);
    };
};

exports.delete = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    try{
        const prod_cart_id = req.params.prod_cart_id;
        const carts = await Cart.findAll({where:{user_id: req.user.id}});
        const cart_id = carts[carts.length - 1].id;
        const prodCarts = await ProductCart.findAll({where:{id : prod_cart_id , cart_id:cart_id}});
        if(!prodCarts.length){
            res.status(404).json({msg: 'The product cart not found'});
        }
        const save = await prodCarts[0].destroy();
        res.status(201).json({msg: 'The product cart has been deleted'});
    }catch(err){
        next(err,req,res,next);
    };
};

