const blogCategory              = require("../repositories.js/blogcategory.repository")
const BaseCategoryControler  = require("./basecategory.controler")

class BlogCategory extends BaseCategoryControler{
    constructor(){
        super(blogCategory,'Category')
    }
}

module.exports = BlogCategory