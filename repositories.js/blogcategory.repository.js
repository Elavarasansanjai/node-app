const blogCategory            = require("../models/blogcategory.model");
const BaseRepository          = require("./base.repository");

class BlogRepository extends BaseRepository {
    constructor(){
        super(blogCategory)
    }
}


module.exports   = BlogRepository