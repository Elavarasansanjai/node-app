
const mongoose      = require('mongoose')
const Schema        = mongoose.Schema
const couponSchema  = new Schema({
    couponname        : { type : String,  required : true, unique : true, set: (v) => v.toUpperCase(),},
    expirytime        : { type : Date, required : true  },
    discount          : { type : Number, required : true},
})
const couponModel = mongoose.model('Coupon', couponSchema)
module.exports    = couponModel