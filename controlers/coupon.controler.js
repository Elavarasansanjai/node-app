
const CouponRepository      = require("../repositories.js/coupon.repository")
const BaseCategoryControler = require("./basecategory.controler")

class CouponControler extends BaseCategoryControler {
    constructor(){
        super(CouponRepository, 'Coupon')
    }
}

module.exports  = CouponControler