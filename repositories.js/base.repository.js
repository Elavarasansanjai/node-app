
class BaseRepository  {
    constructor(_collection){
        this.collection = _collection
    }
    findone = (email) => {
        return this.collection.findOne({email})
    }
    find = () => {
        return this.collection.find().lean().exec();
    }
    findById = (id) => {  
        return this.collection.findById(id)
    }
    create = (model) => {
        return this.collection.create(model)
    }
    update(_id,model) {
        return this.collection.findByIdAndUpdate(_id, model,{new:true})
    }
    deleteById(id) {
        return this.collection.findByIdAndDelete(id)
    }
}

module.exports = BaseRepository