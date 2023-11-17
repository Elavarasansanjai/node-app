
const ProductControler                        = require("../controlers/product.controler")
const product                                 = new ProductControler() 
const express                                 = require("express")
const router                                  = express.Router()
const  {authMiddleWares , adminMiddleWares}   = require("../middlewares/auth.middlewares")
const { starValidate }                        = require("../middlewares/userLogin-regiser-inputErrors")
const uploadImages                            = require('../middlewares/uploadimages.middleware')

router.post('/add-products',     [authMiddleWares, adminMiddleWares],product.addProduct)
router.put('/img-products/:id',  [authMiddleWares,adminMiddleWares,uploadImages.uploadPhoto.array('images',10),uploadImages.productResize], product.uploadProductImages)
router.post('/get-products',     product.getAProduct)
router.get('/getall-products',   product.getAllProducts)
router.post('/upd-products',     [authMiddleWares, adminMiddleWares],product.updateProdect)
router.post('/dlt-products',     [authMiddleWares, adminMiddleWares],product.deleteProdect)
router.post('/rating-products',  [starValidate,authMiddleWares, adminMiddleWares,],product.rating)

module.exports      = router
