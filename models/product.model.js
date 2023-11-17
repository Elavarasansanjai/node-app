const mongoose                     = require('mongoose')
const Schema                       = mongoose.Schema
const objectId                     = mongoose.Types.ObjectId
const productSchema                = new Schema({
            title                  : {type : String, required : true, trim : true},
            slug                   : {type : String, required : true, unique : true, lowercase : true},
            description            : {type : String, required : true},
            price                  : {type : Number, required : true},
            category               : {type : String, required : true, },
            quantity               : {type : Number, required : true},
            sold                   : {type : Number, default : 0},
            images                 : {type : Array},
            color                  : {type : String, required : true,},
            ratings                : [{star: Number, postedby :{ type : objectId, ref : "User"},comment : {type : String}}],
            totalrating            : {type : String, default : 0},
            brand                  : {type : String, required : true,},
} ,{ timestamps : true})

const product                      = mongoose.model('Product', productSchema)

module.exports                     = product
