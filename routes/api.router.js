const express                               = require("express")
const router                                = express.Router()
const userRouter                            = require("./user.routes")
const productRouter                         = require("./product.router")
const blogRouter                            = require("./blog.routes")
const ProductCategoryRouter                 = require("./productcategory.router")
const BlogCategoryRouter                    = require("./blogcategory.router")
const BrandRouter                           = require("./brand.router")
const couponRouter                          = require("./coupon.routes")

router.use('/user',         userRouter)
router.use('/product',      productRouter)
router.use('/blog',         blogRouter)
router.use('/productctry',  ProductCategoryRouter)
router.use('/blogctry',     BlogCategoryRouter)
router.use('/brand',        BrandRouter)
router.use('/coupon',       couponRouter)

module.exports = router