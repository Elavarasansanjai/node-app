
const { validationResult }   = require('express-validator')

const errorHandler  = (req, res) => {
    const errors       = validationResult(req);
    if (!errors.isEmpty()) {
        // navigate error msg to single object
        let err        = {}
        errors.errors.map(errItem => {
            const path = errItem.path
            const msg  = errItem.msg 
            err[path]  = msg
        })
        return {sts : false, error : err}
    }else {
        return {sts : true,  error : []}
    }
}
module.exports   = errorHandler