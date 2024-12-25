
const Product = require('../Models/Product');
const { validationResult } = require('express-validator');

exports.createProduct = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    const {name , desc , price , qty} = req.body;
    try{
        const prodcut = await Product.create({
            name,
            desc,
            price,
            qty,
            user_id: req.user.id,
        });
    }catch(err){
        console.log('err in product creation');
        return res.status(500).json({msg:'something went wrong'});
    }
    res.status(201).json({msg:'The product has been created'});
};


exports.getAllOfMyProducts = async (req,res,next)=>{
    try{
        const prodcuts = await Product.findAll({where:{user_id:req.user.id}});
        res.json({msg:'Your products :',products: prodcuts})
    }catch(err){
        console.log(err);
        res.status(500).json({msg:'something went wrong'});
    }
};
exports.updateProduct = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg , filed: errors.array()[0].path});
    }
    const {name , desc , price , qty} = req.body;
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
        const save = await product.save();
        res.json({msg:'You have updated the product: ',product : product});
    }catch(err){
        console.log(err);
        res.status(500).json({msg:'something went wrong'});
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
        console.log(err);
        res.status(500).json({msg:'something went wrong'});
    }
};

