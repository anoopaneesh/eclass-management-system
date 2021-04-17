var express = require('express');
var router = express.Router();
var adminHelper = require('../helpers/adminHelper')
var mailer = require('../config/mail-config')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/dashboard', { admin: true });
});

router.get('/add-teacher',(req,res)=>{
  res.render('admin/add-teacher',{admin:true})
})

router.post('/add-teacher',(req,res)=>{
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
router.get('/view-teachers',(req,res)=>{
  adminHelper.getTeachers().then((teachers)=>{
    res.render('admin/view-teachers',{admin:true,teachers})
  })
})
router.get('/edit-teacher/:id',(req,res)=>{
  adminHelper.getTeacher(req.params.id).then((teacher)=>{
    res.render('admin/edit-teacher',{admin:true,teacher})
  })
})
router.post('/edit-teacher/:id',(req,res)=>{

  adminHelper.updateTeacher(req.params.id,req.body).then((response)=>{
    if(response.status){
      if(req.files){
        let image = req.files.image
        image.mv('./public/teacher-img/'+req.params.id+'.jpg')
      }
      res.redirect('/admin/view-teachers')
    } 
  })
})

module.exports = router;
