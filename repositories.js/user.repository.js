const BaseRepository = require("./base.repository")
const user = require("../models/user.model")

class UserRepository extends BaseRepository{
    constructor(){
        super(user)
    }
}

module.exports = UserRepository