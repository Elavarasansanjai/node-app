const express          =  require("express")
const UserControler    =  require("../controlers/user.controler")
const {validateRegister, emailvalidate, passWordValidate,validateOtp,checkBooleanMiddleware} = require("../middlewares/userLogin-regiser-inputErrors")
const {authMiddleWares , adminMiddleWares} = require("../middlewares/auth.middlewares")
const router           =  express.Router()
const userControler    =  new UserControler()

router.get('/get',         [authMiddleWares,adminMiddleWares],userControler.findAll)
router.get('/get/:id',     [authMiddleWares],userControler.getById)
router.post('/register-otp',emailvalidate, userControler.emailVeryfication)
router.post('/register-verify',[emailvalidate,validateOtp],userControler.verifyEmailOtp)
router.post('/register',   [validateRegister,passWordValidate,emailvalidate],userControler.createUser)
router.post('/upd',        [validateRegister,passWordValidate,emailvalidate,authMiddleWares],userControler.update)
router.post('/delete',     [authMiddleWares,adminMiddleWares],userControler.deleteById)
router.post('/login',      [passWordValidate, emailvalidate],userControler.loginUser)
router.post('/admin-login',[passWordValidate, emailvalidate],userControler.adminLogin)
router.post('/block-user', [authMiddleWares,adminMiddleWares],userControler.isBlock)
router.post('/unblock-user',  [authMiddleWares,adminMiddleWares],userControler.isUnBlock)
router.post('/refresh',userControler.handlerefreshToken)
router.post('/logout',userControler.logout)
router.post('/upd-password',    [passWordValidate,emailvalidate,authMiddleWares],userControler.updatePassword)
router.post('/forgot-password',  userControler.forgotPassword)
router.put('/reset-password/:token', passWordValidate,userControler.resetPassword)
router.post('/whishlist',authMiddleWares,userControler.addToWishList)
router.get('/get-whishlist/:id',[authMiddleWares],userControler.getById)
router.post('/address',[authMiddleWares],userControler.saveAddress)
router.post('/send-otp',[validateRegister],userControler.sendOtptoUser)
router.post('/cart',[authMiddleWares],userControler.userCart)
router.post('/get-cart',[authMiddleWares],userControler.getUserCart)
router.post('/delete-cart',[authMiddleWares],userControler.emptyCart)
router.post('/cart/apply-coupon',[authMiddleWares],userControler.applyCoupon)
router.post('/cart/cod-order',[checkBooleanMiddleware,authMiddleWares],userControler.createOrder)
router.get('/get-orders',[authMiddleWares],userControler.getOrders)
router.post('/upd-orders',[authMiddleWares,adminMiddleWares],userControler.updateOrders)
router.post('/payment',[authMiddleWares],userControler.payment)
router.post('/confirm-pay',[authMiddleWares],userControler.confirmPayment)
module.exports = router