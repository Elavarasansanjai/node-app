
const mongoose             = require("mongoose")
const Shema                = mongoose.Schema

const blogCategorySchema       = new Shema({
    title    : {type : String, required : true, unique : true, index : true}
},{timestamps : true})



const blogcategoryModel = mongoose.model("BCategory" , blogCategorySchema)

module.exports             = blogcategoryModel