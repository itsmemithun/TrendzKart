import express from 'express';
const router = express.Router();
import usercontroller from '../controller/userController.js';
import nocache from 'nocache';
import passport from 'passport';
import  { isLoggedIn }  from '../middleware/user_middleware.js';

//home route
router.get('/',nocache(), usercontroller.home);
// Login page render route
router.get('/user_login', nocache(),  usercontroller.userLogin);
// Login page validate route
router.post('/user_login', nocache(), passport.authenticate('local', {failureFlash : true, failureRedirect : '/user_login'}), usercontroller.userValidate);
// Signup page render route
router.get('/user_signup', nocache(), usercontroller.userSignup);
// Signup page validation route
router.post('/register', usercontroller.userRegister);
// Otp verification route
router.post('/register/otp', nocache(), usercontroller.emailVerificationRegister);
// User dashboard render route
router.get('/user/user_account', nocache(), isLoggedIn, usercontroller.userdashboard);
// User dashboard edit post route
router.post('/user/user_account', isLoggedIn, usercontroller.userdashboardedit);
// user Logout route
router.get('/user/user_logout', isLoggedIn, usercontroller.userLogout);
// Add product to wish list
router.post('/user/wishlist/add/:id', usercontroller.addtowishlist);

export default router;