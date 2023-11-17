
const mongoose             = require("mongoose")
const Shema                = mongoose.Schema

const BrandSchema       = new Shema({
    title    : {type : String, required : true, unique : true, index : true}
},{timestamps : true})



const BrandModel = mongoose.model("Brand" , BrandSchema)

module.exports             = BrandModel