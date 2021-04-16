const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync')
const passport=require('passport')
const users=require("../controllers/users");
const { post } = require('./campgrounds');
router.route('/register')
      .get(users.renderRegister)
      .post(catchAsync(users.create))

router.route('/login')
      .get(users.renderlogin)
      .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login)
      
router.get('/logout',users.logout)
module.exports=router;