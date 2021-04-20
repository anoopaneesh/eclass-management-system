var db = require('../config/config')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectID
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
    }
}