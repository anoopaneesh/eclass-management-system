var db = require('../config/config')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')


module.exports = {
    addTeacher : (data) => {
        return new Promise(async(resolve,reject)=>{
            data.password = await bcrypt.hash(data.dob,10)  
            db.get().collection(collection.TEACHER_COLLECTION).insertOne(data).then((response)=>{
                resolve(response.ops[0])
            }).catch(err=>{
                reject(err)
            })
        })
    }
}