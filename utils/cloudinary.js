const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name  : process.env.CLOUD_NAME,
  api_key     : process.env.API_KEY, 
  api_secret  : process.env.API_SECRET 
});

const cloudinaryUploading  = async (fileToUploads) => {
   return new Promise(resolve => {
     cloudinary.uploader.upload(fileToUploads , (err,result) => {
      if(err){
        console.log(err)
      }else{
        resolve(
          { url : result.secure_url },
          { resource_type : 'auto' }
         )
      }
     })
   })
}

module.exports  = cloudinaryUploading