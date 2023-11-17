const mongoose          = require('mongoose')
const mongoDB_Url       = process.env.MONGODB_URL
mongoose.connect(mongoDB_Url)   

mongoose.connection.on('error',(err)=>{
    console.log(err)
})

mongoose.connection.on('connected',(res)=>{
    console.log('db connected successfully...')
})