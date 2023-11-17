const mongoose   = require('mongoose')

const schema     = mongoose.Schema
const objectId   = mongoose.Types.ObjectId
const userSchema = new schema({
    _id               : {type : objectId, auto : true},
    firstname         : {type : String, required : true,},
    lastname          : {type : String, required : true,},
    email             : {type : String, required : true, unique : true,},
    mobile            : {type : String, required : true, unique : true,},
    registerotp       : {type : Number},
    registerexpires   : {type: Date},
    veryfyuser        : {type : Boolean, default : false},
    password          : {type : String, required : true},
    role              : {type : String, default : 'user'},
    cart              : {type : Array , default : []},
    isBlock           : {type : Boolean, default : false},
    address           : {type : String},
    wishlist          : [{type : objectId, ref : 'Product'}],
    refreshToken      : {type  : String},
    passwordChangedAt : Date,
    passwordResetToken: String,
    passwordResetExpries : Date
},{timestamps : true})

const user       = mongoose.model('User', userSchema)

module.exports   = user