
const BrandRepository        = require("../repositories.js/brand.repository")
const BaseCategoryControler  = require("./basecategory.controler")

class BrandControler extends BaseCategoryControler {
    constructor(){
        super(BrandRepository,'Brand')
    }
}

module.exports  = BrandControler