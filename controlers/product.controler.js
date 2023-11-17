
const product              = require("../models/product.model")
const slugify              = require('slugify')
const validateMongoDbId    = require("../utils/validateMongoDbId")
const { validationResult } = require("express-validator")
const uploadImage          = require("../utils/uploadI-image")

class ProductControler {
       addProduct = async  (req, res) => {
        try{
            let productData   = req.body
            if(productData.title) {
                productData.slug = slugify(productData.title)
            }
            const createProduct = await product.create(productData)
            if(!createProduct){
                return res.status(200).json({sts: true, msg : 'Failed to create product'})
            }
            return res.status(200).json({sts: true, msg : 'Product added success!'})
        } catch(err) {
            return res.status(200).json({sts: false, msg : err.message})
        }
       }

       //getProduct
       getAProduct = async  (req,res) => {
        try{
            console.log(req.query)
            const { _id }             = req.body   
            const findProduct         = await product.findById(_id)
            if(!findProduct) {     
              return  res.status(200).json({sts : false, msg : "something went wrong! product does't exist"})
            }
            return res.status(200).json({sts : true, msg : 'Sucess', data : findProduct})

        }catch (err) {
            return res.status(200).json({sts: false, msg : err.message})
        }
       }

       //getAll Products
       getAllProducts = async (req , res) => {
            try{
                //filtering 
                const queryObj            = {...req.query}
                const excludeFields       = ['page', 'sort', 'limit', 'fields']
                excludeFields.forEach(el => delete queryObj[el])
                let queryStr              = JSON.stringify(queryObj) 
                queryStr                  = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
                let query                 =   product.find(JSON.parse(queryStr)) 

                //sorting 

                if(req.query.sort) {
                    const sortBy          = req.query.sort.split(',').join(" ")
                    query                 = query.sort(sortBy)
                } else {
                    query                 = query.sort("-createdAt")
                }
                
                // limit for feilds 

                if(req.query.sort) {
                    const feilds          = req.query.feilds.split(',').join(" ")
                    query                 = query.select(feilds)
                } else {
                    query                 = query.select("-__v")
                }
                
                // perpage page 
                
                if(req.query.page){
                    const page            = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
                    const perPage         = parseInt(req.query.perpage) || 10; // Items per page
                    const startIndex      = (page - 1) * perPage;
                    const totalLength     = await product.countDocuments();
                    if(startIndex >= totalLength) throw new Error ('This page does not exists')
                    query                 =  product.find().skip(startIndex).limit(perPage)}
                
                const  products  =  await query 
                if(!products) {
                    return res.status(200).json({sts : false, msg: 'Something went wrong'}) 
                }
                return res.status(200).json({sts : true,  msg : 'Success', data : products,totalPage : Math.ceil(totalLength/perPage),totalData: totalLength})
            }catch (err) {
                return  res.status(200).json({sts : false, msg: err.message})  
            }
        }
    
       // update Product
       updateProdect  =  async (req , res) => {
          try{ 
            let updData     =  req.body
            if(updData.title) {
                console.log(slugify(updData.title))
                updData.slug = slugify(updData.title)
            }
            console.log(updData)
            validateMongoDbId(res, updData._id)
            const updProduct  = await product.findOneAndUpdate(updData._id , updData)
            console.log(updProduct)
            if(!updProduct) {
                return res.status(200).json({sts : false, msg: 'Something went wrong'})
            }
            return res.status(200).json({sts : true,  msg : 'Product updated success', data : updProduct})
          }catch (err) {
            return  res.status(200).json({sts : false, msg: err.message})
          }
       }

    //delete product
    deleteProdect  =  async (req , res) => {
        try{ 
          let {_id}     =  req.body
          validateMongoDbId(res, _id)
          const dltProduct  = await product.findByIdAndDelete(_id )
          if(!dltProduct) {
              return res.status(200).json({sts : false, msg: 'Something went wrong'})
          }
          return res.status(200).json({sts : true,  msg : 'Product deleted success'})
        }catch (err) {
          return  res.status(200).json({sts : false, msg: err.message})
        }
    }

    // rating product
    rating = async (req, res) => {

        try{
            const { _id }              = req?.user
            const { star, productId,comment }  = req?.body
            validateMongoDbId(res,productId)

            // input validation 
            const errors       = validationResult(req);
            if (!errors.isEmpty()) {
                // navigate error msg to single object
                let err        = {}
                errors.errors.map(errItem => {
                    const path = errItem.path
                    const msg  = errItem.msg 
                    err[path]  = msg
                })
                return res.status(200).json({ error : err});
            }

            const curentProduct     = await product.findById(productId)
            const alreadyRated      = curentProduct?.ratings.find(id => id?.postedby?.toString() === _id.toString())
            if(alreadyRated) {
                const filter        = { _id: productId, 'ratings.postedby': _id };
                const update        = { $set: { 'ratings.$.star': star,'ratings.$.comment' : comment} };
                const updateRating  = await product.updateOne(filter,update)
                if(!updateRating) throw new Error ("Failed to create rating!")
            }else{
                const reateProduct  = await product.findByIdAndUpdate(productId, {
                    $push  : { ratings : { star : star , postedby : _id, comment : comment?comment:""}}
                })
                if(!reateProduct) throw new Error("Failed to create rating!")
            }

            //total rating 
            const totalRating          = curentProduct?.ratings.map(item => item.star).reduce((prev,curr)=>prev+curr,0)
            const ratingLength         = curentProduct?.ratings?.length
            const averageRating        = Math.round(totalRating/ratingLength)
            curentProduct.totalrating  = averageRating 
            await curentProduct.save()
            return res.status(200).json({sts: true, msg : 'Successfuly created rating!',data : curentProduct})
        }catch (err) {
           return res.status(200).json({sts : false, msg : err.message})
        }
    }
    
    //upload image files handler
    uploadProductImages = async (req, res) => {

       try{ 
            const {id}        = req.params
            validateMongoDbId(res,id)
            const urls        = await uploadImage(req, res)
            const findProduct = await product.findByIdAndUpdate(id,{images : urls.map(file => {return file})},{new : true})
            return res.json({sts : true , data : findProduct})
       }catch (err) {
            return res.json({sts : true , err: err.message})
       }
    }
    

}

module.exports = ProductControler