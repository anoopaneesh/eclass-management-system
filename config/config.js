const mongoClient = require('mongodb').MongoClient

const state = {
    db:null
}
module.exports.connection = (done) => {
    let url = 'mongodb://localhost:27017'
    let dbname = 'classroom'
    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db = data.db(dbname)
        done()
    })
}

module.exports.get = () => {
    return state.db
}