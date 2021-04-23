var db = require('../config/config')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectID
var bcrypt = require('bcrypt')
module.exports={
    doLogin:(data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.TEACHER_COLLECTION).findOne({email:data.email}).then((teacher)=>{
                if(teacher){
                    bcrypt.compare(data.password,teacher.password).then((status)=>{
                        if(status){
                            resolve({teacher,status:true})
                        }else{
                            resolve({teacher:null,status:false})
                        }
                    })
                }else{
                    resolve({teacher:null,status:false})
                }
            }).catch(err=>{
                reject(err)
            })
        })
    },
    getTeachers: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.TEACHER_COLLECTION).find().toArray().then((response) => {
                resolve(response)
            }).catch(err => {
                reject(err)
            })

        })
    },
    getTeacher: (teacherId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.TEACHER_COLLECTION).findOne({ _id: objectId(teacherId) }).then((response) => {
                resolve(response)
            }).catch(err => {
                reject(err)
            })
        })
    },
    updateTeacher: (teacherId, data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.TEACHER_COLLECTION).updateOne({ _id: objectId(teacherId) }, {
                $set: {
                    name: data.name,
                    email: data.email,
                    mobile: data.mobile,
                    dob: data.dob,
                    salary: data.salary,
                    subject: data.subject,
                    address: data.address,

                }
            }).then((response) => {
                resolve({status:true})
            }).catch(err => {
                reject()
            })
        })
    },
    changePassword:(teacherId,data)=>{
        return new Promise(async(resolve,reject)=>{
            let teacher = await db.get().collection(collection.TEACHER_COLLECTION).findOne({_id:objectId(teacherId)})
            if(teacher){
               let result = await bcrypt.compare(data.currpassword,teacher.password)
               if(result){
                    let newpass = await bcrypt.hash(data.newpassword,10)
                    db.get().collection(collection.TEACHER_COLLECTION).updateOne({_id:objectId(teacherId)},{
                        $set:{
                            password:newpass
                        }
                    }).then((response)=>{
                        resolve({status:true})
                    }).catch(err=>{
                        reject(err)
                    })

               }else{
                   resolve({status:false})
               }
            }
        })
    }
}