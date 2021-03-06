var express = require('express');
var router = express.Router();
var studentHelper = require('../helpers/studentHelper')
var teacherHelper = require('../helpers/teacherHelper')
var timetableHelper = require('../helpers/timetableHelper')
var announcementHelper = require('../helpers/announcementHelpers');
var fs = require('fs');
const { response } = require('express');
var verifyLogin = (req, res, next) => {
  if (req.session.student) {
    next()
  } else {
    res.redirect('/student/login')
  }
}
router.get('/', verifyLogin, function (req, res, next) {
  res.render('student/dashboard', { student: req.session.student, admin: null });
});
router.get('/login', (req, res) => {
  res.render('student/login', { loginErr: req.session.studentLoginErr })
})
router.post('/login', (req, res) => {
  studentHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.student = response.student
      res.redirect('/student')
    } else {
      req.session.studentLoginErr = 'Invalid email or password'
      res.redirect('/student/login')
    }
  })
})
router.get('/edit-profile', verifyLogin, (req, res) => {
  studentHelper.getStudent(req.params.id).then((student) => {
    res.render('student/edit-profile', { student: req.session.student })
  })
})
router.post('/edit-profile/:id', verifyLogin, (req, res) => {

  studentHelper.updateStudent(req.params.id, req.body).then((response) => {
    if (response.status) {
      if (req.files) {
        let image = req.files.image
        image.mv('./public/student-img/' + req.params.id + '.jpg')
      }
      res.redirect('/student')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.student = null
  res.redirect('/student/login')
})
router.get('/change-password', verifyLogin, (req, res) => {
  res.render('student/change-password', { student: req.session.student, err: req.session.changePasswordErr })
})
router.post('/change-password', (req, res) => {
  studentHelper.changePassword(req.session.student._id, req.body).then((response) => {
    if (response) {
      res.redirect('/student/login')
    } else {
      req.session.changePasswordErr = 'Invalid credentials'
      res.redirect('/student/change-password')
    }
  })
})
router.get('/view-timetable', verifyLogin, (req, res) => {
  timetableHelper.getTimetable().then((timetable) => {
    res.render('student/view-timetable', { student: req.session.student, timetable })
  })
})
router.get('/view-announcements', verifyLogin, (req, res) => {
  announcementHelper.getAllAnnouncements().then((announcements) => {
    res.render('student/view-announcements', { student: req.session.student, announcements })
  })
})
router.get('/view-assignments', verifyLogin, (req, res) => {
  teacherHelper.viewAssignments().then((assignments) => {
    assignments = assignments.map(assign => {
      let found = assign.submission.find(e => e.student == req.session.student._id)
      if (found) {
        return {
          ...assign,
          submission: true,
          studentId: req.session.student._id,
          extname: found.extname
        }
      } else {
        return {
          ...assign,
          submission: false
        }
      }
    })

    res.render('student/view-assignments', { student: req.session.student, assignments })
  })
})
router.post('/submit-assignment/:id', verifyLogin, (req, res) => {
  let file = req.files.file
  if (!file) {
    res.status(404).send("Error .. please select a file")
  } else {
    data = {
      extname: file.mimetype.split('/')[1],
    }
    studentHelper.submitAssignment(req.params.id,data,req.session.student._id).then((response) => {
      if (response.status) {
        file.mv('./public/submissions/' + req.params.id + req.session.student._id + '.' + data.extname)
        res.redirect('/student')
      }
    })
  }
})
router.get('/delete-submission/:id', verifyLogin, async (req, res) => {
  studentHelper.deleteSubmission(req.params.id, req.session.student._id).then((response) => {
    if (response.status) {
      const directory = './public/submissions/'
      const filename = "" + req.params.id + req.session.student._id

      fs.readdir(directory, (err, files) => {
        files.forEach(file => {
          if (file.split('.')[0] === filename) {
            fs.unlink("" + directory + file, (err) => {
              if (err) {
                console.log(err)
              } else {
                console.log(file + ' removed successfully')
              }
            })
          }
        });
      });
      res.redirect('/student')
    }
  })
})
module.exports = router;