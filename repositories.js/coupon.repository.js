
const coupon           = require("../models/coupon.model")
const BaseRepository   = require("./base.repository")

class CouponRepository extends BaseRepository {
    constructor(){
        super(coupon)
    }
}

module.exports  = CouponRepository