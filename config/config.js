const mongoClient = require('mongodb').MongoClient

const state = {
    db: null
}



module.exports.connection = (done) => {
    // let url = 'mongodb://localhost:27017'
    // let dbname = 'classroom'
    // mongoClient.connect(url,(err,data)=>{
    //     if(err) return done(err)
    //     state.db = data.db(dbname)
    //     done()
    // })

    let dbname = 'classroom'
    const uri = process.env.MONGO_URL;
    const client = new mongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if (err) {
            done(err)
        } else {
            state.db = client.db(dbname);
            done()
        }
    });
}

module.exports.get = () => {
    return state.db
}