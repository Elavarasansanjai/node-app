
const mongoose   = require("mongoose")
const Shema      = mongoose.Schema

const cartShema = new Shema({
    products           : [ { product : {type : mongoose.Schema.Types.ObjectId, ref : "Product"},count : Number,clolor : String, price : Number}],
    carttotal          : {type : Number},
    totalAfterDiscount : {type : Number},
    orderby            : { type :  mongoose.Schema.Types.ObjectId, ref : 'User' }
},{ timestamps    : true})

const cartModel   = mongoose.model('Cart', cartShema)

module.exports    = cartModel