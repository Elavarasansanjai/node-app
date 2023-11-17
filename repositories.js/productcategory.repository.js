
const category                = require("../models/productcategory.model");
const BaseRepository          = require("./base.repository");

class CategoryRepository extends BaseRepository {
    constructor(){
        super(category)
    }
}


module.exports   = CategoryRepository