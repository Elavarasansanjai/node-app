const UserRepository = require("../repositories.js/user.repository") 
const BaseControler  = require("./base.controler")

class UserControler extends BaseControler{
    constructor(){
        super (UserRepository)
    }
}

module.exports = UserControler