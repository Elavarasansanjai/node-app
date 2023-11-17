const ProductCategoryRepository          = require("../repositories.js/productcategory.repository")
const BaseCategoryControler  = require("./basecategory.controler")

class ProductCategory extends BaseCategoryControler{
    constructor(){
        super(ProductCategoryRepository,'Product-Category')
    }
}

module.exports     = ProductCategory