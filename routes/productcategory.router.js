
const express                     = require("express")
const Router                      = express.Router()
const ProductCategoryControler    = require("../controlers/productcategory.controler")
const category                    = new ProductCategoryControler()
const {authMiddleWares , adminMiddleWares} = require("../middlewares/auth.middlewares")
const {titleValidate}             = require("../middlewares/userLogin-regiser-inputErrors")

Router.post('/create-category',     [titleValidate, authMiddleWares, adminMiddleWares],category.createCategory)
Router.post('/upd-category',        [titleValidate, authMiddleWares, adminMiddleWares],category.updateCategory)
Router.post('/delete-category',     [authMiddleWares, adminMiddleWares],category.deleteCategory)
Router.post('/get-category',        [authMiddleWares, adminMiddleWares],category.getCategory)
Router.post('/all-category',        [authMiddleWares, adminMiddleWares],category.getAllCategory)


module.exports         = Router