var express = require('express');
const fs = require('fs')
var router = express.Router();
var adminHelper = require('../helpers/adminHelper')
var teacherHelper = require('../helpers/teacherHelper')
var timetableHelper = require('../helpers/timetableHelper')
var studentHelper = require('../helpers/studentHelper')
var announcementHelper = require('../helpers/announcementHelpers')
var mailer = require('../config/mail-config')
/* GET home page. */
var verifyLogin = (req,res,next) =>{
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin/login')
  }
}
router.get('/', verifyLogin,function(req, res, next) {
  adminHelper.getDashboard().then((response)=>{
    res.render('admin/dashboard', { admin: req.session.admin,data:response.data});
  })
  
});

router.get('/login',(req,res)=>{
  res.render('admin/login',{admin:req.session.admin})
})

router.post('/login',(req,res)=>{
  adminHelper.doLogin(req.body).then((response)=>{
    let loginErr = null
    if(response.status){
      req.session.admin = response.admin,
      req.session.adminLogin = true
      res.redirect('/admin')
    }else{
      loginErr = 'Incorrect email or password'
      res.render('admin/login',{admin:true,loginErr})
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.admin = null
  req.session.adminLogin = false
  res.redirect('/admin/login')
})

router.get('/add-teacher',verifyLogin,(req,res)=>{
  res.render('admin/add-teacher',{admin:req.session.admin})
})

router.post('/add-teacher',verifyLogin,(req,res)=>{
  adminHelper.addTeacher(req.body).then((data)=>{
    var mailOptions = {
      from: 'anooppk265@gmail.com',
      to: data.email,
      subject: 'You have been registered as a teacher at Eclass Management',
      text: `Your Teacher id is : ${data.email} Your password is : ${data.dob}`
    };
    mailer.get().sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    let image = req.files.image
    image.mv('./public/teacher-img/'+data._id+'.jpg',(err,done)=>{
      if(err){
        console.log(`Image file moving error : ${err}`)
      }else{
        res.redirect('/admin')
      }
    })  
  })
})
router.get('/view-teachers',verifyLogin,(req,res)=>{
  teacherHelper.getTeachers().then((teachers)=>{
    res.render('admin/view-teachers',{admin:req.session.admin,teachers})
  })
})
router.get('/edit-teacher/:id',verifyLogin,(req,res)=>{
  teacherHelper.getTeacher(req.params.id).then((tchr)=>{
    res.render('admin/edit-teacher',{admin:req.session.admin,tchr})
  })
})
router.post('/edit-teacher/:id',verifyLogin,(req,res)=>{

  teacherHelper.updateTeacher(req.params.id,req.body).then((response)=>{
    if(response.status){
      if(req.files){
        let image = req.files.image
        image.mv('./public/teacher-img/'+req.params.id+'.jpg')
      }
      res.redirect('/admin/view-teachers')
    } 
  })
})
router.get('/delete-teacher/:id',verifyLogin,(req,res)=>{
  adminHelper.removeTeacher(req.params.id).then((response)=>{
    if(response.status){
      res.redirect('/admin/view-teachers')
    }
  })
})
router.get('/add-timetable',verifyLogin,(req,res)=>{
  res.render('admin/add-timetable',{admin:req.session.admin})
})
router.post('/add-timetable',verifyLogin,(req,res)=>{
  adminHelper.addTimetable(req.body).then((timetable)=>{
    res.redirect('/admin')
  })
})
router.get('/view-timetable',verifyLogin,(req,res)=>{
  timetableHelper.getTimetable().then((timetable)=>{
    res.render('admin/view-timetable',{admin:req.session.admin,timetable})
  })
})
router.get('/add-student',verifyLogin,(req,res)=>{
  res.render('admin/add-student',{admin:req.session.admin})
})
router.post('/add-student',verifyLogin,(req,res)=>{
  adminHelper.addStudent(req.body).then((data)=>{
    var mailOptions = {
      from: 'anooppk265@gmail.com',
      to: data.email,
      subject: 'You have been registered as a student at Eclass Management',
      text: `Your student id is : ${data.email} Your password is : ${data.dob}`
    };
    mailer.get().sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    let image = req.files.image
    image.mv('./public/student-img/'+data._id+'.jpg',(err,done)=>{
      if(err){
        console.log(`Image file moving error : ${err}`)
      }else{
        res.redirect('/admin')
      }
    })  
  })
})
router.get('/view-students',verifyLogin,(req,res)=>{
  studentHelper.getStudents().then((students)=>{
    res.render('admin/view-students',{admin:req.session.admin,students})
  })
})
router.get('/edit-student/:id',verifyLogin,(req,res)=>{
  studentHelper.getStudent(req.params.id).then((std)=>{
    res.render('admin/edit-student',{admin:req.session.admin,std})
  })
})
router.post('/edit-student/:id',verifyLogin,(req,res)=>{

  studentHelper.updateStudent(req.params.id,req.body).then((response)=>{
    if(response.status){
      if(req.files){
        let image = req.files.image
        image.mv('./public/student-img/'+req.params.id+'.jpg')
      }
      res.redirect('/admin/view-students')
    } 
  })
})
router.get('/delete-student/:id',verifyLogin,(req,res)=>{
  adminHelper.removeStudent(req.params.id).then((response)=>{
    if(response.status){
      res.redirect('/admin/view-students')
    }
  })
})
router.get('/add-announcement',verifyLogin,(req,res)=>{
  res.render('admin/announcement',{admin:req.session.admin})
})
router.post('/add-announcement',verifyLogin,(req,res)=>{
  let announcement = req.body
  let files = []
  if(Array.isArray(req.files.files)){
    files = [...req.files.files]
  }else{
    files = [req.files.files]
  }
  announcement.attachments = []
  if(files){ 
   files.map((file)=>{
    announcement.attachments.push({
      name:file.name,
      type:file.mimetype.split('/')[0],
      extname:file.mimetype.split('/')[1],
    })
   })
   console.log(announcement)
  }
  adminHelper.addAnnouncement(announcement).then((response)=>{
    if(files){
      files.map((file)=>{
        file.mv(`./public/attachments/${response._id}${file.name}`)
      })
    }
    res.redirect('/admin')
  })
})
router.get('/view-announcements',verifyLogin,(req,res)=>{
  announcementHelper.getAllAnnouncements().then((announcements)=>{
    res.render('admin/view-announcements',{admin:req.session.admin,announcements})
  })
})
router.get('/delete-announcement/:id',(req,res)=>{
  adminHelper.removeAnnouncement(req.params.id).then((response)=>{
    if(response.status){
      response.attachments.map((e)=>{
        let filename = ""+req.params.id+e.name
        let path = './public/attachments/'+filename
        fs.unlink(path, (err) => {
          if (err) {
            console.error(err)
            return
          }
          console.log(filename+' file removed')
        })
      })
      res.redirect('/admin/view-announcements')
    }else{
      res.status(404).send("Error occured")
    }
  })
})

module.exports = router;
