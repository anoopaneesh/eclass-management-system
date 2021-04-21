var db = require('../config/config')
var collection = require('../config/collections')
const  ObjectId  = require('mongodb').ObjectID
module.exports={
    getAllAnnouncements:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ANNOUNCEMENT_COLLECTION).find().toArray().then((response)=>{
                resolve(response)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    
}