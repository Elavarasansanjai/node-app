const validateMongoDbId    = require('./validateMongoDbId')
const cloudinaryUploading  = require("./cloudinary")
const fs                   = require('fs')
const UploadImage = async (req,  res)  => {
    
    const uploader    = (path) => cloudinaryUploading(path, 'images')
    let urls          = []
    const files       = req.files
    console.log(files)
    if(files){
        for(let file of files){
            const newPath = await uploader(file.path)
            urls.push(newPath)
            fs.unlinkSync(file.path) 
        }
    }
    console.log(urls)
    return urls
}

module.exports =  UploadImage