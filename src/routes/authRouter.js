const express=require('express')
const router=express.Router()

const {register,login,refresh,logout}=require('../controllers/auth.controller')
const {isAuthenticated}=require('../middlewares/auth.middleware')

router.post('/register',register)
router.post('/login',login)
router.post('/refresh',refresh)
router.post('/logout',isAuthenticated,logout)

module.exports=router;