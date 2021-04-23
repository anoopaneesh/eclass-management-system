var db = require('../config/config')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectID
var bcrypt = require('bcrypt')
module.exports={
    getStudents: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.STUDENT_COLLECTION).find().toArray().then((response) => {
                resolve(response)
            }).catch(err => {
                reject(err)
            })

        })
    },
    doLogin:(data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.STUDENT_COLLECTION).findOne({email:data.email}).then((student)=>{
                if(student){
                    bcrypt.compare(data.password,student.password).then((status)=>{
                        if(status){
                            resolve({student,status:true})
                        }else{
                            resolve({student:null,status:false})
                        }
                    })
                }else{
                    resolve({student:null,status:false})
                }
            }).catch(err=>{
                reject(err)
            })
        })
    },
    getStudent: (studentId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.STUDENT_COLLECTION).findOne({ _id: objectId(studentId) }).then((response) => {
                resolve(response)
            }).catch(err => {
                reject(err)
            })
        })
    },
    updateStudent: (studentId, data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.STUDENT_COLLECTION).updateOne({ _id: objectId(studentId) }, {
                $set: {
                    name: data.name,
                    email: data.email,
                    mobile: data.mobile,
                    dob: data.dob,
                    gender:data.gender,
                    gname: data.gname,
                    gemail: data.gemail,
                    address: data.address,
                    identify:data.identify

                }
            }).then((response) => {
                resolve({status:true})
            }).catch(err => {
                reject()
            })
        })
    },
    changePassword:(studentId,data)=>{
        return new Promise(async(resolve,reject)=>{
            let student = await db.get().collection(collection.STUDENT_COLLECTION).findOne({_id:objectId(studentId)})
            if(student){
               let result = await bcrypt.compare(data.currpassword,student.password)
               if(result){
                    let newpass = await bcrypt.hash(data.newpassword,10)
                    db.get().collection(collection.STUDENT_COLLECTION).updateOne({_id:objectId(studentId)},{
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
    },
    submitAssignment:(assignmentId,data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ASSIGNMENT_COLLECTION).updateOne({_id:objectId(assignmentId)},{
                $push:{
                    'submission':data
                }
            }).then((response)=>{
                resolve({status:true})
            }).catch(err=>{
                reject(err)
            })
        })
    },
    deleteSubmission:(assignmentId,studentId)=>{
      
        return new Promise(async(resolve,reject)=>{
            console.log(assignmentId,studentId)
            db.get().collection(collection.ASSIGNMENT_COLLECTION).update({_id:objectId(assignmentId)},{
                $pull:{
                    'submission':{'student':studentId}
                }
            }).then((response)=>{
                console.log(response)
                resolve({status:true})
            }).catch(err=>{
                reject(err)
            })
        })
    }
}