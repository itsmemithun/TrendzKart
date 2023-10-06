import express from 'express';
const router = express.Router();
import usercontroller from '../controller/userController.js';
import nocache from 'nocache';
import passport from 'passport';
import  { isLoggedIn }  from '../middleware/user_middleware.js'

router.get('/', isLoggedIn, usercontroller.home);

router.get('/user_login', nocache(), usercontroller.userLogin);

router.post('/user_login', passport.authenticate('local', {failureFlash : true, failureRedirect : '/user_login'}), usercontroller.userValidate);

router.get('/user_signup', nocache(), usercontroller.userSignup);

router.post('/register', usercontroller.userRegister);

router.post('/register/otp', usercontroller.emailVerificationRegister);

export default router;