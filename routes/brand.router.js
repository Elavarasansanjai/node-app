
const express                     = require("express")
const Router                      = express.Router()
const BrandControler              = require("../controlers/brand.controler")
const brand                       = new BrandControler()
const {authMiddleWares , adminMiddleWares} = require("../middlewares/auth.middlewares")
const {titleValidate}             = require("../middlewares/userLogin-regiser-inputErrors")

Router.post('/create-brand',    [titleValidate, authMiddleWares, adminMiddleWares],brand.createCategory)
Router.post('/upd-brand',       [titleValidate, authMiddleWares, adminMiddleWares],brand.updateCategory)
Router.post('/delete-brand',    [authMiddleWares, adminMiddleWares],brand.deleteCategory)
Router.post('/get-brand',       [authMiddleWares, adminMiddleWares],brand.getCategory)
Router.post('/all-brand',       [authMiddleWares, adminMiddleWares],brand.getAllCategory)

module.exports         = Router