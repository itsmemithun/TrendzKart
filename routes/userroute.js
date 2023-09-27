import express from 'express';
const router = express.Router();
import usercontroller from '../controller/userController.js';
import nocache from 'nocache';


router.get('/', (req,res)=>{
  console.log('home');
  res.send('home page');
})

router.get('/user_login', nocache(), usercontroller.userLogin);

router.post('/user_login', usercontroller.userValidate);

router.get('/user_signup', nocache(), usercontroller.userSignup);

router.post('/register', usercontroller.userRegister);

export default router;