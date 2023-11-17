const validateMongooDbId    = require("../utils/validateMongoDbId")
const errorHandler          = require("../utils/error.handler")
class CategoryControler {
    constructor(repoClass,type){
        this.repo = new repoClass
        this.type = type
    }
    
    //create category
    createCategory = async (req, res) => {
        try{
            const err             = errorHandler(req,res)
            if(!err?.sts){
                return res.status(200).json(err)
            }else{
                const body            = req?.body
                const createCategory  = await this.repo.create(body)
                if(!createCategory) throw new Error ("Something went wrong")
                return res.status(200).json({sts : true, msg : `${this.type} created!`})
            }
        } catch (err) {
           return  res.status(200).json({sts : false, msg : err.message})
        }
    }
     //update category
     updateCategory = async (req, res) => {
        try{
            const err             = errorHandler(req,res)
            if(!err?.sts){
                res.status(200).json(err)
            }else{
                const { _id }     = req?.body
                validateMongooDbId(res,_id)
                const body        = req?.body
                const updCategory = await this.repo.update(_id,body)
                if(!updCategory) throw new Error ("Category updated failed.")
                return res.status(200).json({sts : true, msg : `${this.type} updated!`})
            }
        } catch (err) {
           return  res.status(200).json({sts : false, msg : err.message})
        }
     } 
 
 
     //delete Category 
     deleteCategory = async (req, res) => {
 
         try{
          const { _id }          = req?.body
          validateMongooDbId(res,_id)
          const deleteCategory   = await this.repo.deleteById(_id)
          if(!deleteCategory) throw new Error ("Category not found.")
          res.status(200).json({sts : true, msg : `${this.type} deleted success!`})
         } catch (err) {
          res.status(200).json({sts : false, msg : err.message})
         }
     } 
 
     //get a Category 
     getCategory = async (req, res) => {
 
         try{
          const { _id }          = req?.body
          validateMongooDbId(res,_id)
          const getCategory   = await this.repo.findById(_id)
          if(!getCategory) throw new Error ("Category not found.")
          res.status(200).json({sts : true, msg : 'success!', data : getCategory})
         } catch (err) {
          res.status(200).json({sts : false, msg : err.message})
         }
     } 
     //get all Category 
     getAllCategory = async (req, res) => {
 
         try{
          const getAllCategory   = await this.repo.find()
          if(!getAllCategory) throw new Error ("Category not found.")
          res.status(200).json({sts : true, msg : 'success!', data : getAllCategory})
         } catch (err) {
          res.status(200).json({sts : false, msg : err.message})
         }
     }

}

module.exports    = CategoryControler