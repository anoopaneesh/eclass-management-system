var db = require('../config/config')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID

module.exports = {
    doLogin:(userData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ADMIN_COLLECTION).findOne({email:userData.email}).then((admin)=>{
                if(admin){
                    bcrypt.compare(userData.password,admin.password).then((status)=>{
                        if(status){
                            resolve({admin,status:true})
                        }else{
                            resolve({admin:null,status:false})
                        }
                    })
                }else{
                    resolve({admin:null,status:false})
                }
            }).catch(err=>{
                reject(err)
            })
        })
    },
    addTeacher: (data) => {
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.dob, 10)
            db.get().collection(collection.TEACHER_COLLECTION).insertOne(data).then((response) => {
                resolve(response.ops[0])
            }).catch(err => {
                reject(err)
            })
        })
    },
    addTimetable:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let timetable = await db.get().collection(collection.TIMETABLE_COLLECTION).find({day:data.day})
            if(timetable){
                db.get().collection(collection.TIMETABLE_COLLECTION).updateOne({day:data.day},{
                    $set:data
                }).then(()=>{
                    resolve()
                }).catch(err=>{
                    reject()
                })
            }else{
                db.get().collection(collection.TIMETABLE_COLLECTION).insertOne(data).then((response)=>{
                    resolve(response.ops[0])
                }).catch(err=>{
                    reject(err)
                })
            }
        })
    }
    
}