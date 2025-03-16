
const Product = require('../Models/Product');
const { validationResult } = require('express-validator');
const sequelize = require('../config/Sequelize');

exports.createProduct = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    const {name , desc , price , qty , brand} = req.body;
    const img = req.files['productImg'] ? req.files['productImg'][0] : null;
    try{
        if(!img){
            const prodcut = await Product.create({
                name,
                desc,
                price,
                qty,
                user_id: req.user.id,
                brand,
            });   
            res.status(201).json({msg:'The product has been created',prodcut});
        }else{
            const prodcut = await Product.create({
                name,
                desc,
                price,
                qty,
                user_id: req.user.id,
                img_url: '/' + img.path.slice(7,img.length),
                brand
            });   
            res.status(201).json({msg:'The product has been created',prodcut});
        }
    }catch(err){
        next(err,req,res,next);
    }
};


exports.getAllOfMyProducts = async (req,res,next)=>{
    try{
        const [products, metadata] = await sequelize.query(`SELECT * FROM Products WHERE user_id = ${req.user.id} ORDER BY id DESC;  `);
        res.json({msg:'Your products :',products: products})
    }catch(err){
        next(err,req,res,next);
    }
};

exports.latestProducts = async (req,res,next)=>{
    try{
        const [products,metadata] = await sequelize.query('SELECT * FROM Products ORDER BY id DESC');
        res.json({msg:'Home Product :',products: products})
    }catch(err){
        next(err,req,res,next);
    }
};


exports.trendProducts = async (req,res,next)=>{
    try{
        const [products, _] = await sequelize.query(`SELECT DISTINCT p.* FROM products AS p JOIN product_carts AS pc ON p.id = pc.product_id ORDER BY  pc.id DESC;`);
        res.json({ msg: 'Home Product:', products });
    }catch(err){
        next(err,req,res,next);
    }
};

exports.updateProduct = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    const {name , desc , price , qty , brand} = req.body;
    const { prod_id } = req.params;
    try{
        const products = await Product.findAll({where:{id: prod_id , user_id:req.user.id}});
        if(!products.length){
            res.status(404).json({msg:'Product not found'});
        }
        const product = products[0];
        product.name = name;
        product.desc = desc;
        product.price = price;
        product.qty = qty;
        product.brand = brand;
        const save = await product.save();
        res.status(201).json({msg:'You have updated the product: ',product : product});
    }catch(err){
        next(err,req,res,next);
    }
};

exports.deleteProduct = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    const { prod_id } = req.params;
    try{
        const products = await Product.findAll({where:{id: prod_id , user_id:req.user.id}});
        if(!products.length){
            res.status(404).json({msg:'Product not found'});
        }
        const product = products[0];
        product.destroy();
        res.json({msg:'You have delete the product'});
    }catch(err){
        next(err,req,res,next);
        // res.status(500).json({msg:'something went wrong'});
    }
};
