const FavorateProduct = require('../Models/FavorateProduct');
const { validationResult } = require('express-validator');
const Product = require('../Models/Product');

exports.create = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    const prod_id = req.params.prod_id;
    try{
        const product = await Product.findAll({where:{id: prod_id}});
        if(!product.length){
            const err = new Error();
            err.statusCode = 404;
            err.msg = 'Product not found';
            throw err;
        }
        const fp = await FavorateProduct.create({
            user_id: req.user.id,
            product_id: prod_id
        });
        res.status(201).json({msg:'You added product to your favorates'});
    }catch(err){
        next(err,req,res,next);
    };
};

exports.get = async (req,res,next)=>{
    try{
        const favorateProduct = await FavorateProduct.findAll({where: {user_id: req.user.id}});
        const product = await Product.findAll();
        const fp = [];
        for(let i = 0 ; i < favorateProduct.length ; ++i){
            for(let j = 0 ; j < product.length ; ++j){
                if(favorateProduct[i].product_id === product[j].id){
                    fp.push(product[j]);
                }
            }
        }
        res.json({msg:'User favorate product:',product: fp});
    }catch(err){
        next(err,req,res,next);
    };

};

exports.delete = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    const fav_id = req.params.fav_id;
    try{
        const fav = await FavorateProduct.findAll({where:{id: fav_id}});
        if(!fav.length){
            const err = new Error();
            err.statusCode = 404;
            err.msg = 'Favorate Product not found';
            throw err;
        }
        const del = await fav[0].destroy();
        res.status(200).json({msg:'You reomved product to your favorates'});
    }catch(err){
        next(err,req,res,next);
    }
};