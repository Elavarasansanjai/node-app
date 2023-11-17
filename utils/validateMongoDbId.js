const mongoose          = require('mongoose')

//check valid id
const validateMongoDbId = ( res,id) => {
    const isValid       =  mongoose.Types.ObjectId.isValid(id)
    if(!isValid){
        throw new  Error("this id not valid")
    }else{
        return
    }
}

module.exports =  validateMongoDbId