
const ProductCart = require('../Models/productCart');
const Cart = require('../Models/Cart');
const {validationResult} = require('express-validator');
const UserNotficationController = require('../Controllers/UserNotficationController');
// import sequelize from '../config/Sequelize';
const sequelize = require('../config/Sequelize');

exports.get = async (req, res, next) => {
    try {
        const carts = await Cart.findAll({ where: { user_id: req.user.id } });
        const cart_id = carts[carts.length - 1].id; // Get the last cart ID
        const [products] = await sequelize.query(`SELECT * FROM product_carts WHERE cart_id = ${cart_id} ORDER BY id DESC`);
        let cartSum = 0;
        const resProducts = [];
        for (const productAction of products) {
            const [product] = await sequelize.query(`SELECT * FROM products WHERE id = ${productAction.product_id}`);
            if (product.length > 0) {
                let existing = false;
                for(const one of resProducts){
                    if(one.id === productAction.product_id){
                        existing = true;
                        one.qty = +one.qty + +productAction.qty;
                    }
                }
                const totalPrice = +product[0].price *+productAction.qty; // Assuming qty is in productAction
                product[0].qty = productAction.qty;
                cartSum += totalPrice;
                if(!existing){
                    resProducts.push(product[0]);
                }
            }
        }
        res.json({
            msg: 'Cart Products:',
            products: resProducts,
            cartSum,
        });
    } catch (err) {
        next(err); // Simplified error handling
    }
};

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
        const notfication = await UserNotficationController.addedToCart(req.user.id); 
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
        const notfication = await UserNotficationController.removedFromCart(req.user.id);
        res.status(201).json({msg: 'The product cart has been deleted'});
    }catch(err){
        next(err,req,res,next);
    };
};


exports.addOneProduct= async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    try{
        const prodId = req.params.prod_id;
        const productCart = await ProductCart.findAll({where:{product_id: prodId}});
        if(productCart.length){
            productCart[0].qty= +productCart[0].qty + 1;
            productCart[0].save();
        }
        res.status(201).json({
            msg: 'Increased by one:',
        });
    }catch(err){
        next(err,req,res,next);
    };
};
exports.removeOneProduct= async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    try{
        const prodId = req.params.prod_id;
        const productCart = await ProductCart.findAll({where:{product_id: prodId}});
        if(productCart.length){
            productCart[0].qty= +productCart[0].qty - 1;
            if(!productCart[0].qty){
                productCart[0].destroy();
            }
            productCart[0].save();
        }
        res.status(201).json({
            msg: 'Increased by one:',
        });
    }catch(err){
        next(err,req,res,next);
    };
};
