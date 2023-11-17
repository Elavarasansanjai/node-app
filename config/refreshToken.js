const jwt    = require("jsonwebtoken")

const generateRefreshWebToken = (id) => {
    return jwt.sign({userId : id}, process.env.JWt_SECRETKEY, {expiresIn : '1y'})
}

module.exports =  generateRefreshWebToken