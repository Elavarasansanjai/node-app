const BaseRepository = require("./base.repository")
const blog = require("../models/blog.model")

class blogRepository extends BaseRepository{
    constructor(){
        super(blog)
    }
}

module.exports = blogRepository