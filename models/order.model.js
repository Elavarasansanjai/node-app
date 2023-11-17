
const mongoose   = require("mongoose")
const Shema      = mongoose.Schema

const orderShema = new Shema({
    products      : [ { product : {type : mongoose.Schema.Types.ObjectId, ref : "Product"},count : Number,clolor : String}],
    paymentIntent : {},
    orderstatus   : { type : String, default : 'Not Processed', enum : ['Not Processed','Cash on Delevery','Processing!','Dispatched','Canceclled','Delivered']},
    orderby       : { type :  mongoose.Schema.Types.ObjectId, ref : 'User' }
},{ timestamps    : true})

const orderModel = mongoose.model('Order', orderShema)

module.exports   = orderModel