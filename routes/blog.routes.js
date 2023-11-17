const express                              = require('express')
const router                               = express.Router()
const BlogControler                        = require("../controlers/blog.controler")
const blogControler                        = new BlogControler()
const {authMiddleWares}                    = require("../middlewares/auth.middlewares")
const uploadImages                         = require("../middlewares/uploadimages.middleware")

router.post('/add-blog',     [authMiddleWares],blogControler.createBlog)
router.post('/upd-blog',     [authMiddleWares],blogControler.updateBlog)
router.put('/img-blog/:id',  [authMiddleWares,uploadImages.uploadPhoto.array('images',10),uploadImages.blogResize], blogControler.uploadBlogImages)
router.post('/dlt-blog',     [authMiddleWares],blogControler.deleteById)
router.post('/get-blog',     [authMiddleWares],blogControler.getBlog)
router.get('/all-blog',      [authMiddleWares],blogControler.findAll)
router.post('/like-blog',    [authMiddleWares],blogControler.isLiked)
router.post('/dislike-blog', [authMiddleWares],blogControler.disLiked)

module.exports     = router