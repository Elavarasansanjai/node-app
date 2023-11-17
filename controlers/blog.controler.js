const Blogrepository                   = require("../repositories.js/blog.repository")
const BaseControler                    = require("./base.controler")
const repo                             = new Blogrepository()
const blogModel                        = require("../models/blog.model")
const validateMongoDbId                = require("../utils/validateMongoDbId")
const uploadImage                      = require("../utils/uploadI-image")

class BlogControler extends BaseControler {
    constructor(){
        super(Blogrepository)
    
    }

    //create Blog
    createBlog = async (req, res) => {
        try{ 
            const body    = req.body
            const blog    = await this.repo.create(body)
            if(blog) res.status(200).json({sts : true, msg  : 'Blog created Success'})
        }catch(err){
            res.status(200).json({sts : false, msg : err.message})
        }
    }

    //updateBlog 
    updateBlog = async (req,res) => {
        try{
            
            const { _id }     = req.body
            console.log(_id)
            validateMongoDbId(res,_id)
            const updateBlog  = await this.repo.update(_id,req.body)
            if(!updateBlog) throw new Error ('Update failed. Something went wrong')
            res.status(200).json({sts : true, msg : "Blog updated success"})
        }catch (err) {
            res.status(200).json({sts : false, msg : err.message})
        }
    }

    //View Blog
    getBlog = async (req, res) => {
        try{
            const { _id }    = req.body
            validateMongoDbId(res,_id)
            const blog       = await blogModel.findById(_id).populate('likes').populate('disLikes')
            if(!blog) throw new Error ("Blog does not exist")

            const newBlog    = await this.repo.update(_id,{ $inc : {numViews : 1 }})
            res.status(200).json({sts : true, msg : 'Success', data : blog})
        } catch (err){
            res.status(200).json({sts : false, msg : err.message})
        }
    }

    // isLiked 
    isLiked  = async (req, res) => {
        try{
            const {_id}    = req.body
            //find the login user
            const user     = req?.user?._id
            validateMongoDbId(res,_id)
            //find the blog which you want to be like
            const blog     = await  this.repo.findById(_id)
            //find if the user has liked the blog
            const isliked  = blog?.isLiked
            //find if the user hs disliked the blog
            const alreadyLiked = blog?.disLikes?.find(userId => userId?.toString() === user?.toString())
            if(alreadyLiked){
                const blog = await this.repo.update(_id, {$pull : {disLikes : user},isDisLiked : false})
               return  res.status(200).json({sts: true, blog, msg : 'Success'})
            }
            if(isliked){
                const blog = await this.repo.update(_id, {$pull : {likes : user},isLiked : false})
               return res.status(200).json({sts: true, blog, msg : 'Success'})
            }else{
                const blog = await this.repo.update(_id, {$push : {likes : user},isLiked : true})
               return res.status(200).json({sts: true, blog, msg : 'Success'})
            }
        }catch(err){
           return res.status(200).json({sts : false, msg : err.message})
        }
    }

    //dis liked the blog
    disLiked  = async (req, res) => {
        try{
            const {_id}    = req.body
            //find the login user
            const user     = req?.user?._id
            validateMongoDbId(res,_id)
            //find the blog which you want to be like
            const blog     = await  this.repo.findById(_id)
            //find if the user has liked the blog
            const isDisLiked  = blog?.isDisLiked
            //find if the user hs disliked the blog
            const alreadyLiked = blog?.likes?.find(userId => userId?.toString() === user?.toString())
            if(alreadyLiked){
                const blog = await this.repo.update(_id, {$pull : {likes : user},isLiked : false})
               return res.status(200).json({sts: true, blog, msg : 'Success'})
            }
            if(isDisLiked){
                const blog = await this.repo.update(_id, {$pull : {disLikes : user},isDisLiked : false})
               return res.status(200).json({sts: true, blog, msg : 'Success'})
            }else{
                const blog = await this.repo.update(_id, {$push : {disLikes : user},isDisLiked : true})
              return  res.status(200).json({sts: true, blog, msg : 'Success'})
            }
        }catch(err){
          return  res.status(200).json({sts : false, msg : err.message})
        }
    }
    
    //upload plog image 
    uploadBlogImages = async (req, res) => {

        try{  
             const {id }       = req.params
             const urls        = await uploadImage(req, res)
             const findBlog    = await this.repo.update(id,{images : urls.map(file => {return file})})
             return res.json({sts : true , data : findBlog})
        }catch (err) {
             return res.json({sts : true , err: err.message})
        }
     }
}

module.exports    = BlogControler