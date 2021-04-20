var db = require('../config/config')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectID
module.exports = {
    getTimetable:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.TIMETABLE_COLLECTION).find().toArray().then((timetable)=>{
                resolve(timetable)
            }).catch(err=>{
                reject(err)
            })
        })
    }
}