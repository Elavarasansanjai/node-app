
const mongoose             = require("mongoose")
const Shema                = mongoose.Schema
const ObjectId             = mongoose.Schema.Types.ObjectId

const categorySchema       = new Shema({
    title    : {type : String, required : true, unique : true, index : true}
},{timestamps : true})



const ProductcategoryModel = mongoose.model("PCategory" , categorySchema)

module.exports             = ProductcategoryModel