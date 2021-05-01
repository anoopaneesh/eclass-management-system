var db = require('../config/config')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID

module.exports = {
    doLogin: (userData) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: userData.email }).then((admin) => {
                if (admin) {
                    bcrypt.compare(userData.password, admin.password).then((status) => {
                        if (status) {
                            resolve({ admin, status: true })
                        } else {
                            resolve({ admin: null, status: false })
                        }
                    })
                } else {
                    resolve({ admin: null, status: false })
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    getDashboard: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let teachers = await db.get().collection(collection.TEACHER_COLLECTION).find().toArray()
                let students = await db.get().collection(collection.STUDENT_COLLECTION).find().toArray()
                let announcements = await db.get().collection(collection.ANNOUNCEMENT_COLLECTION).find().toArray()
                resolve({
                    data:{
                        teachers:teachers.length,
                        students:students.length,
                        announcements:announcements.length
                    },
                    status:'ok'
                })
            } catch (err) {
                reject(err)
            }

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
    addTimetable: (data) => {
        return new Promise(async (resolve, reject) => {
            let timetable = await db.get().collection(collection.TIMETABLE_COLLECTION).findOne({ day: data.day })
            if (timetable) {
                db.get().collection(collection.TIMETABLE_COLLECTION).updateOne({ day: data.day }, {
                    $set: data
                }).then(() => {
                    resolve()
                }).catch(err => {
                    reject()
                })
            } else {
                db.get().collection(collection.TIMETABLE_COLLECTION).insertOne(data).then((response) => {
                    resolve(response.ops[0])
                }).catch(err => {
                    reject(err)
                })
            }
        })
    },
    addStudent: (data) => {
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.dob, 10)
            db.get().collection(collection.STUDENT_COLLECTION).insertOne(data).then((response) => {
                resolve(response.ops[0])
            }).catch(err => {
                reject()
            })
        })
    },
    removeTeacher: (teacherId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.TEACHER_COLLECTION).remove({ _id: objectId(teacherId) }).then((response) => {
                if (response.writeError) {
                    resolve({ status: false })
                } else {
                    resolve({ status: true })
                }
            })
        })
    },
    removeStudent: (studentId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.STUDENT_COLLECTION).remove({ _id: objectId(studentId) }).then((response) => {
                if (response.writeError) {
                    resolve({ status: false })
                } else {
                    resolve({ status: true })
                }
            })
        })
    },
    addAnnouncement: (data) => {
        return new Promise((resolve, reject) => {
            data.date = new Date().toISOString().split('T')[0]
            db.get().collection(collection.ANNOUNCEMENT_COLLECTION).insertOne(data).then((response) => {
                resolve(response.ops[0])
            }).catch(err => {
                reject(err)
            })
        })
    },
    removeAnnouncement: (announcementId) => {
        return new Promise(async (resolve, reject) => {
            let announcement = await db.get().collection(collection.ANNOUNCEMENT_COLLECTION).findOne({ _id: objectId(announcementId) })
            attachments = announcement.attachments
            db.get().collection(collection.ANNOUNCEMENT_COLLECTION).remove({ _id: objectId(announcementId) }).then((response) => {
                if (response.writeError) {
                    resolve({ status: false })
                } else {
                    resolve({ status: true, attachments })
                }
            })
        })
    }

}