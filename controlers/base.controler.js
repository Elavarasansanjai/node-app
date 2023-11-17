const httpStsCodes                    = require("http-status-codes")
const bcrypt                          = require("bcrypt")
const jwt                             = require("jsonwebtoken")
const { validationResult }            = require("express-validator")
const validateMongoDbId               = require("../utils/validateMongoDbId")
const jwtSecretKey                    = process.env.JWt_SECRETKEY
const generateRefresToken             = require("../config/refreshToken")
const User                            = require("../models/user.model")
const crypto                          = require('crypto')
const sendEmail                       = require("./email.controler")
const {generateOTP, SendOtp}          = require("../utils/otp-handles")
const cartModel                       = require("../models/cart.model")
const product                         = require("../models/product.model")
const Coupon                          = require("../models/coupon.model")
const orderModel                      = require("../models/order.model")
const uniqid                          = require("uniqid")
const stripPayment                    = require("../utils/strip.payment")
const stripe = require('stripe')(process.env.SKIPE_SECRET_KEY);

class BaseControler {
    constructor(repoClass){
        this.repo      = new repoClass()
        this.products  = []
        this.cartTotal = 0
    }
    ok = (res, docs) => {
        return res.status(httpStsCodes.OK).json({sts : true,msg:'Successfuly get data', data:docs, err:[]})
    }
    internalServerError = (res,err) => {
        return res.status(httpStsCodes.INTERNAL_SERVER_ERROR).json({sts : false,msg:'Failed to get Data'})
    }

    //get all data
    findAll = async (req,res) => {
        try{
            const docs = await this.repo.find()
            return this.ok(res,docs)
        }catch(err){
            return this.internalServerError(err)
        }
    }
    
    //email veryfication 
    emailVeryfication = async (req, res) => {
       try{
            const { email } = req.body
            const expires   = Date.now() + 3600000; // 1 hour
            const otp       = generateOTP()
            const existingUser = await this.repo.findone(email)
            const emailHandler = async (email,otp,expires,type) => {
                const setUser = await this.repo.collection.findOneAndUpdate({email : email},{registerotp : otp,registerexpires : expires},{upsert : true, new : true, setDefaultsOnInsert : true})
                if(!setUser) throw new Error('User register failed')
                const emailLink           = `You are receiving this because your Registration is pending! Your OTP is ${otp}. It will be expired one hour`
                let sendEmailData       = {to : email, subject : "Nandu Products", text : emailLink}
                await sendEmail(sendEmailData,req,res)
                return res.status(200).json({sts : true, msg : `Successfuly ${type} Email`})
            }
            if(existingUser){
                await emailHandler(email,otp,expires,'Resent')
                
            }else{
                await emailHandler(email,otp,expires,'Sent')

            }
       }catch(err){
           res.status(200).json({sts : false, msg:err.message})
       }
    } 

    verifyEmailOtp = async (req,res) => {
        try{
            const {email,registerotp}  = req.body
            const user         = await User.findOne({email : email,registerotp : registerotp , registerexpires: {$gt : Date.now()}})
            if(!user) throw new Error ('Time expired please try again later')
            user.registerotp       = undefined
            user.registerexpires   = undefined
            user.veryfyuser        = true
            user.save()
            res.status(200).json({sts : false, msg:'Email veryfication success!'})
        }catch (err){
            res.status(200).json({sts : false, msg:err.message})
        }
    }
    //create new user
    createUser = async (req,res) => {
        try{
            let body           = req.body
            //check user input validation
            const errors       = validationResult(req);
            if (!errors.isEmpty()) {
                // navigate error msg to single object
                let err        = {}
                errors.errors.map(errItem => {
                    const path = errItem.path
                    const msg  = errItem.msg 
                    err[path]  = msg
                })
                return res.status(200).json({ error : err});
            }
            const isUserLogin  = await this.repo.findone(body.email)
            body.password      = await bcrypt.hash(body.password, 10)
             
            if(!isUserLogin){
                this.repo.create(body)
                return res.status(httpStsCodes.OK).json({sts : true, msg : 'Register Success'})
            }else{
                return res.status(200).json({sts : false, msg : 'User alredy registered'})
            }
        }catch(err){
            console.log(err)
            return this.internalServerError(res,err)
        }
    }
    
    //upddate user
    update = async (req,res) => {
        try{
            const body  = req.body
            const {_id} = req.user
            validateMongoDbId(res, _id)
            const docs  = await this.repo.update(_id,body)
            if(docs){
                return res.status(httpStsCodes.OK).json({sts : true, msg : 'Updated Success'})
            }else{
                return res.status(200).json({sts : false,msg:'Failed update'})
            }
        }catch(err){
           return  res.status(200).json({msg : err.message})
        }
    }
    //delete 
    deleteById = (req,res) => {
        let { _id }  = req.body
        validateMongoDbId(res, _id)
        this.repo.deleteById(_id).then(doc => {
            return res.status(httpStsCodes.OK).json({sts:true,msg:'user delete success'})
        }).catch(err => {
            return res.status(200).json({msg : err.message})

        })
    }

    //
    getById = (req,res) => {
        let id = req.params.id
        validateMongoDbId(res, id)
        User.findById(id).populate('wishlist').then(doc => {
            return this.ok(res, doc)
        }).catch(err => {
            return res.status(200).json({msg : err.message})
        })
    }
     
    login = async (existingUser, password ,res) => {
        if(!existingUser){
            return res.status(200).json({sts : false, msg : "Authentication failed please register"})
        }
        //compare password
        const checkPassword     = await bcrypt.compare(password, existingUser.password)
        if(!checkPassword){
            return res.status(200).json({sts : false, msg : "Authentication failed wrong password"})
        }
        const token             = await jwt.sign({userId : existingUser._id},jwtSecretKey,{expiresIn:"1d"})
        const refreshToken      = await generateRefresToken(existingUser._id)
        console.log(refreshToken)
        await this.repo.update(existingUser._id, {refreshToken : refreshToken})
        const data = {
                        _id       : existingUser._id , 
                        firstname : existingUser.firstname, 
                        lastname  : existingUser.lastname,
                        mobile    : existingUser.mobile,
                        email     : existingUser.email
                    }
        return res.status(200).json({sts:true,msg:'Login Success',data:{...data,token:token,refreshToken}})
    }
    

    //loginUser

    loginUser = async (req,res) => {

        const {email , password} =  req.body
        //check user Alreaady exists
        const existingUser = await this.repo.findone(email)
        //login function 
        this.login(existingUser, password, res)

    }

    //admin login 
    adminLogin = async (req, res) => {

        const {email, password} = req.body
        // admin already exists
        const existingUser      = await this.repo.findone(email)  

        if(existingUser.role === 'admin'){
            this.login(existingUser,password,res)
        }else {
            return res.status(200).json({sts: false, msg : 'Athendication failed, you are not a adimin'})
        }
    }

    //block user 
    isBlock = async (req, res) => {
          try{
            const {_id} = req.body
             validateMongoDbId(res, _id)
             await this.repo.update(_id, {isBlocked : true})
            res.status(200).json({sts : true, msg: 'User Blocked'})
          } catch (err) {
            res.status(200).json({msg : err.message})
          }
    }
    //unblock user 

    isUnBlock = async (req, res) => {
          try{
            const {_id} = req.body
            validateMongoDbId(res, _id)
             await this.repo.update(_id, {isBlocked : false})
            res.status(200).json({sts : true, msg: 'User Unblocked'})
          } catch (err) {
            console.log(err.Error)
            res.status(200).json({msg : err.message})
          }
    }

    // refresh token

    handlerefreshToken = async (req, res) => {
        try{
            let refreshToken = req.body.refreshToken
            if(!refreshToken) throw new Error('Please Provide Refresh token')
            const user       = await User.findOne({refreshToken})
            if(!user) throw new Error('No Refresh Token present in db or not matched')
            jwt.verify(refreshToken,jwtSecretKey, async (err, decoded)=>{
               if(err || user.id !== decoded.userId){
                throw new Error("There is something wrong with refresh token")
               }
               const accesToken = await jwt.sign({userId : user._id},jwtSecretKey,{expiresIn:"1d"})
               res.status(200).json(({sts : true , accesToken}))
            })
 
        }catch(err){
            res.status(200).json({sts:false,msg :  err.message})
        }
    }

    //logout 

    logout = async (req,res) => {
        try{
            let refreshToken = req.body.refreshToken
            if(!refreshToken) throw new Error('Please Provide Refresh token')
            await User.findOneAndUpdate({refreshToken},{refreshToken : ""})

        }catch(err){
            res.status(200).json({sts: false, msg : err.message})
        }
    }

    //update password 

    updatePassword = async (req, res) => {
        const { _id }                  = req.user
        const{ password }              = req.body
        try{
            validateMongoDbId(res, _id)
            const user                 = await this.repo.findById(_id)
            if(password) {

                user.password          =  await bcrypt.hash(password, 10)
                const updatePassword   = await  user.save()
                res.status(200).json({sts : true, msg : 'Password updated success!', data : updatePassword})
            }
        } catch (err) {
            res.status(200).json({sts : false, msg : err.message})
        }
    }

    // forgot password

    forgotPassword  = async (req, res) => {     
       try{
           const {  email }          = req.body 
           const user                = await this.repo.findone(email)
           if( !user ) {
            req.status(200).json({sts : false, msg : 'User not found with this email.'})
           }
           const token               = await crypto.randomBytes(20).toString('hex');
           const expires             = Date.now() + 3600000; // 1 hour
           const hasedToken          = await crypto.createHash("sha256").update(token).digest('hex')
           user.passwordResetToken   = hasedToken
           user.passwordResetExpries = expires;
           await user.save();
           const emailLink           = `You are receiving this because you  have requested the reset of the password for your account.\n\n
                                        Please click on the following link, or paste this into your browser to complete the process:\n\n
                                        http://${req.headers.host}/user/reset-password/${token}\n\n
                                        If you did not request this, please ignore this email and your password will remain unchanged.\n`
            let sendEmailData       = {to : email, subject : "Password Reset Request", text : emailLink}
            await sendEmail(sendEmailData,req,res)
            res.status(200).json({sts: true, token, msg : 'Password veryfication mail send. please check your mail'})
        }catch(err){
           res.status(200).json({sts : false, msg : err.message})
       }
    }

    //reset token

    resetPassword = async (req, res) => {
       try{
        const { password } = req.body
        const {token}      = req.params 
        const hashToken    = await crypto.createHash("sha256").update(token).digest('hex')
        const user         = await User.findOne({passwordResetToken : hashToken,passwordResetExpries : {$gt : Date.now()}})
        if(!user) throw new Error ('Time expired please try again later')
        user.password               = await bcrypt.hash(password, 10)
        user.passwordResetToken     = undefined
        user.passwordResetExpries   = undefined
        user.save()
        res.status(200).json({sts: true, msg : 'Password change success'})
       }catch (err){ 
        res.status(200).json({sts : false, msg : err.message})
       }
    }

    //add to card function

    addToWishList = async (req, res) => {

        try{
            const userId        = req?.user?._id
            const productId     = req?.body?.productId
            const user          = await this.repo.findById(userId)
            const alreadyAdded  = await user.wishlist.find((id) => id.toString() === productId)
            if(alreadyAdded) {
                const user      = await this.repo.collection.findByIdAndUpdate(userId,{ $pull : {wishlist : productId}})
                res.status(200).json({sts: true, data: user, msg : 'Product removed to cart'})
            }else{
                const user      = await this.repo.collection.findByIdAndUpdate(userId,{ $push : {wishlist : productId}})
                res.status(200).json({sts: true, data: user, msg : 'Product added to cart'})
            }
        }catch (err) {
            res.status(200).json({sts : false , msg : err.message})
        }
        
    }

    // save address
    saveAddress = async (req, res) => {
        try {
            const { _id }       = req.user
            const { address }   = req.body
            const updateAddress = await this.repo.update(_id, {address : address}) 
            if(!updateAddress) throw new Error('Something went wrong')
            res.status(200).json({sts: true, msg: 'Address updated Success', data : updateAddress})
        }catch {
            res.status(200).json({sts : false, msg : err.message})
        }
    }

    // send otp 
    sendOtptoUser = async (req, res ) => {
        try {
            const {mobile}  =  req.body
            if(!mobile) throw new Error('Please provide mobile number')
            await SendOtp(mobile)
            res.status(200).json({sts: true, msg: 'OTP sent success'})
        }catch(err) {
            res.status(200).json({sts : false, msg : err.message})
        }
    }

    userCart = async ( req, res) => {
        const { cart } = req. body
        const { _id }  = req.user
       
        try{
            validateMongoDbId(res,_id)
            
            const user             = await this.repo.findById(_id)
            //check if user already have product in cart 
            const alreadyExistCart = await cartModel.findOne({orderby : user._id})
            if(alreadyExistCart){
                await alreadyExistCart.remove()
            }
            for(let i=0; i < cart.length; i++){
                let object      = {}
                object.product  = cart[i]._id
                object.count    = cart[i].count
                object.color    = cart[i].color
                let getPrice    = await product.findById(cart[i]._id).select('price').exec()
                object.price    = getPrice.price
                
                this.products.push(object) 
            }
            
            for(let i=0; i < this.products.length; i++){
               this.cartTotal = this.cartTotal + this.products[i].price * this.products[i].count
            }
            let products  = this.products
            let cartTotal = this.cartTotal
            const newCart = await new cartModel({
                products   : products,
                carttotal  : cartTotal,
                orderby    : user?._id,
            }).save()
            this.cartTotal = 0
            this.products  = []
            return res.status(200).json({sts: true, msg:'Success', data: newCart})
        }catch(err) {
            return res.status(200).json({sts : false, msg : err.message})
        }
    }
    getUserCart = async (req, res) => {
        try{
            const { _id } = req.user
            validateMongoDbId(res,_id)
            const userCart = await cartModel.findOne({orderby : _id}).populate('products.product')
            if(!userCart) throw new Error('Cart empty')
            return res.status(200).json({sts : true, msg: 'Success', data : userCart})
        }catch(err) {
            return res.status(200).json({sts : false, msg: err.message})
        }
    }
    emptyCart = async (req, res) => {
        try{
            const { _id } = req.user
            validateMongoDbId(res,_id)
            const cart = await cartModel.findOneAndRemove({orderby : _id})
            if(!cart) throw new Error('Cart empty!')
            return res.status(200).json({sts : true, msg: 'Successfuly remove cart', data : cart})
        }catch(err) {
            return res.status(200).json({sts : false, msg: err.message})
        }
    }
    applyCoupon = async (req, res) => {
        try{
            const { coupon } = req.body
            const { _id }    = req.user
            validateMongoDbId(res, _id)
            const validCoupon = await Coupon.findOne({couponname : coupon})
            if(!validCoupon) throw new Error ('Invalid Coupon name')
            if(validCoupon.expirytime > Date.now()){
                const user = await User.findOne({_id : _id})
                let {products, carttotal} = await cartModel.findOne({orderby : user._id}).populate('products.product')
                let totalAfterDiscount    = (carttotal - (carttotal * validCoupon.discount)/100).toFixed(2)
                await cartModel.findOneAndUpdate({orderby : user._id},{totalAfterDiscount},{new : true})
                return res.status(200).json({sts: true, msg : 'Successfuly apply coupon!',data : totalAfterDiscount})
            }else{
                return res.status(200).json({sts: false, msg : 'Coupon time expired!'})

            }
        }catch(err) {
            return res.status(200).json({sts: false, msg : err.message})
        }
    }
    
    // create order for user
    createOrder = async (req, res) => {
        try{
            const { COD, couponApplied} = req.body
            const { _id }               = req.user
            validateMongoDbId(res,_id)
            if(!COD) throw new new Error('create cash order failed')
            const user      = await User.findOne({ _id })
            let userCart    = await cartModel.findOne({orderby : _id})
            if(!userCart) throw new Error ('your Card is empty')
            let finalAmount = 0
            if(couponApplied && userCart.totalAfterDiscount){
                finalAmount = userCart.totalAfterDiscount;
            }else {
                finalAmount = userCart.carttotal
            }
            //create Order
            let newOrder = await new orderModel({
                products      : userCart.products,
                paymentIntent : {
                    id        : uniqid(),
                    method    : "COD",
                    amount    : finalAmount,
                    status    : "Cash on Delevery",
                    created   : Date.now(),
                    currency  : "usd"
                },
                orderby       : _id,
                orderstatus   : "Cash on Delevery"

            }).save()
            let update = userCart.products.map((item)=>{
                return {
                    updateOne : {
                        filter : {_id : item.product._id},
                        update : {$inc : {quantity : -item.count, sold : +item.count}}
                    }
                }
            })
            const updated = await product.bulkWrite(update,{})
            res.status(200).json({sts : true, msg: 'Success'})
        }catch(err) {
            res.status(200).json({sts : false, msg : err.message})
        }
    }

    //get orders
    getOrders =  async (req, res) => {
        try{
            const { _id }    = req.user
            validateMongoDbId(res,_id)
            const userOrders = await orderModel.findOne({orderby : _id}).populate('products.product')
            if(!userOrders) throw new Error ('card empty')
            return res.status(200).json({sts : true, msg : 'Success', data : userOrders})
        }catch (err){
            return res.status(200).json({sts : false, msg : err.message})
        }
    }

    //update Order Status

    updateOrders = async (req, res) => {
        try{
            const {status, _id} = req.body
            validateMongoDbId(res,_id)
            const findOrder = await orderModel.findByIdAndUpdate({_id},{orderstatus : status,paymentIntent : {status : status}},{new : true})
            if(!findOrder) throw new Error ('Cart empty!')
            return res.status(200).json({sts: true, msg:'Order status Updated success!'})
        }catch(err){
            return res.status(200).json({sts : false, msg : err.message})

        }
    }

    payment = async (req, res) => {
        try {
            const { payment,amount } = req.body
            const data = await stripPayment(payment,amount)
            return res.status(200).json(data)
        }catch(err){
            return res.status(200).json({sts : false, msg : err.message})
        }
    }

    confirmPayment = async (req,res) => {
        try{
            const {confirmId} = req.body
            const {error, paymentIntent}= await stripe.paymentIntents.confirm(confirmId);
            if(error){
                return res.status(200).json({sts : false, msg : error})
            }else{
                return res.status(200).json({paymentIntent})
            }

        }catch(err){
            return res.status(200).json({sts : false, msg : err.message})

        }
    }
 
}

module.exports = BaseControler      