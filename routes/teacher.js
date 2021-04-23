var express = require('express');
var router = express.Router();
var teacherHelper = require('../helpers/teacherHelper')
var announcementHelper = require('../helpers/announcementHelpers')
var timetableHelper = require('../helpers/timetableHelper')
var studentHelper = require('../helpers/studentHelper')
var verifyLogin=(req,res,next)=>{
  if(req.session.teacher){
    next()
  }else{
    res.redirect('/teacher/login')
  }
}
/* GET users listing. */
router.get('/',verifyLogin, function(req, res, next) {
  res.render('teacher/dashboard',{teacher:req.session.teacher});
});
router.get('/login',(req,res)=>{
  res.render('teacher/login',{loginErr:req.session.teacherLoginErr})
})
router.post('/login',(req,res)=>{
  teacherHelper.doLogin(req.body).then((response)=>{
    if(response.status){
        req.session.teacher = response.teacher
        res.redirect('/teacher')
    }else{
        req.session.teacherLoginErr = 'Invalid email or password'
        res.redirect('/teacher/login')
    }
})
})
router.get('/edit-profile',verifyLogin,(req,res)=>{
  teacherHelper.getTeacher(req.params.id).then((teacher)=>{
    res.render('teacher/edit-profile',{teacher:req.session.teacher})
  })
})
router.post('/edit-profile/:id',verifyLogin,(req,res)=>{

  teacherHelper.updateTeacher(req.params.id,req.body).then((response)=>{
    if(response.status){
      if(req.files){
        let image = req.files.image
        image.mv('./public/teacher-img/'+req.params.id+'.jpg')
      }
      res.redirect('/teacher')
    } 
  })
})
router.get('/logout',(req,res)=>{
  req.session.teacher = null
  res.redirect('/teacher/login')
})
router.get('/change-password',verifyLogin,(req,res)=>{
  res.render('teacher/change-password',{teacher:req.session.teacher,err:req.session.changePasswordErr})
})
router.post('/change-password',(req,res)=>{
  teacherHelper.changePassword(req.session.teacher._id,req.body).then((response)=>{
      if(response){
          res.redirect('/teacher/login')
      }else{
          req.session.changePasswordErr = 'Invalid credentials'
          res.redirect('/teacher/change-password')
      }
  })
})
router.get('/view-timetable',verifyLogin,(req,res)=>{
  timetableHelper.getTimetable().then((timetable)=>{
    console.log(timetable)
    res.render('teacher/view-timetable',{teacher:req.session.teacher,timetable})
  })
})
router.get('/view-announcements',verifyLogin,(req,res)=>{
  announcementHelper.getAllAnnouncements().then((announcements)=>{
    res.render('teacher/view-announcements',{teacher:req.session.teacher,announcements})
  })
})
router.get('/add-assignment',verifyLogin,(req,res)=>{
  res.render('teacher/add-assignment',{teacher:req.session.teacher})
})
router.post('/add-assignment',verifyLogin,(req,res)=>{
  let assignment = req.body
  let files = []
  if(Array.isArray(req.files.files)){
    files = [...req.files.files]
  }else{
    files = [req.files.files]
  }
  assignment.attachments = []
  assignment.subject = req.session.teacher.subject
  if(files){ 
   files.map((file)=>{
    assignment.attachments.push({
      name:file.name,
      type:file.mimetype.split('/')[0],
      extname:file.mimetype.split('/')[1],
    })
   })
   console.log(assignment)
  }
  teacherHelper.addAssignment(assignment).then((response)=>{
    if(files){
      files.map((file)=>{
        file.mv(`./public/assignments/${response._id}${file.name}`)
      })
    }
    res.redirect('/teacher')
  })
})
module.exports = router;