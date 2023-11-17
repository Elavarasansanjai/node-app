const BaseRepository    = require("./base.repository")
const Brand              = require("../models/brand.model")

class BrandRepository extends BaseRepository{
    constructor(){
        super(Brand)
    }
}

module.exports = BrandRepository