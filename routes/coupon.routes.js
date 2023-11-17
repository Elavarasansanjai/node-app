const express                              = require('express')
const Router                               = express.Router()
const CouponControler                      = require("../controlers/coupon.controler")
const Coupon                               = new CouponControler()
const {authMiddleWares , adminMiddleWares} = require("../middlewares/auth.middlewares")
const { couponValidate }                   = require("../middlewares/userLogin-regiser-inputErrors")

Router.post('/create-coupon',  [ authMiddleWares, adminMiddleWares, couponValidate], Coupon.createCategory)


module.exports = Router