const UserRepository  = require("../repositories.js/user.repository")
const jwt             = require('jsonwebtoken')
const User            = new UserRepository()
//authMiddleWare function
const authMiddleWares = async (req, res, next) => {
    let token;
    console.log(req?.headers.authorization)
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
        try{
            if(token){
               const decoded  = jwt.verify(token, process.env.JWt_SECRETKEY)
               const user     = await User.findById(decoded?.userId)
               if(!user?.veryfyuser) throw new Error ('User not veryfy with email token')
               req.user       = user
               next()
            }
        }catch{
            res.status(200).json({sts:false,msg: 'Token expired or Invalid token, please login again'})

        }
    }else{
        res.status(200).json({sts:false,msg: 'Invalid token'})
    }
}
//admin middlewares
const adminMiddleWares = async (req, res, next) => {
    
    if(req?.user.role !== 'admin'){
        res.status(200).json({sts : false, msg : 'You are not a admin'})
    }else{
        next()
    }
}
module.exports     = {authMiddleWares , adminMiddleWares}