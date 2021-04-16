var express = require('express');
var router = express.Router();
var adminHelper = require('../helpers/adminHelper')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/dashboard', { admin: true });
});

router.get('/add-teacher',(req,res)=>{
  res.render('admin/add-teacher',{admin:true})
})

router.post('/add-teacher',(req,res)=>{
  console.log(req.body)
  adminHelper.addTeacher(req.body).then((data)=>{
    console.log(data)
    res.redirect('/admin')
  })
})

module.exports = router;
