var db = require('../config/config')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectID
module.exports={
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
    }
}