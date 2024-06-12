import express from 'express';
const router = express.Router();
import usercontroller from '../controller/userController.js';
import productcontroller from '../controller/productController.js';
import nocache from 'nocache';
import passport from 'passport';
import  { isLoggedIn,fetchisLoggedIn,isBlocked }  from '../middleware/user_middleware.js';

// router.use((req,res,next)=>{
//   console.log('req:' + req.user);
//   next();
// });

router.use(isBlocked);
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
router.get('/user/user_account/useredit', isLoggedIn, usercontroller.useredit);
// address management
router.get('/user/user_account/address_management/:id', usercontroller.manageAddress);
// Add Address Route
router.post("/user/user_account/add_address", usercontroller.addAddress);
// Address Update Route
router.post("/user/user_account/updateAddress", usercontroller.updateAddress);
// Address Selection
router.post("/user/user_account/selectAddress", usercontroller.selectAddress);
// Address Delete Route
router.post('/user/user_account/delete_address', usercontroller.deleteAddress);
// user Logout route
router.get('/user/user_logout', isLoggedIn, usercontroller.userLogout);
// Add product to wish list
router.post('/user/wishlist/add/:id', fetchisLoggedIn, usercontroller.addtowishlist);
// Remove product from wishlist
router.post('/user/wishlist/remove/:id', fetchisLoggedIn, usercontroller.removefromwishlist);
// Show wishlist Route 
router.get('/user/wishlist', isLoggedIn, usercontroller.showwishlist);
// Show cart 
router.get('/user/cart', isLoggedIn, usercontroller.showcart);
// Add to Cart 
router.post('/user/cart/add/:id', usercontroller.addtocart);
// route to get product price from the Server Side
router.post('/user/getproductprice', usercontroller.getPriceofProduct);
// delete products from cart 
router.get('/user/cart/delete/:id', usercontroller.deleteFromCart);
// delete procucts from wishlist 
router.get('/user/wishlist/delete/:id', usercontroller.deleteFromWishList);
// category page render route 
router.get('/user/category', nocache(), usercontroller.category);
// category post req route
router.post('/user/category', usercontroller.categoryFilter);
// my order route 
router.get('/user/myorders', usercontroller.myorders);



//🔥 Product Routes 🔥//
router.get('/view/:id', productcontroller.view);
router.get('/view/buy/:id', productcontroller.orderDetails);
router.post('/view/buy/:id/proceedToPayment', productcontroller.payment);
router.post('/view/buy/proceedToCodPayment', productcontroller.codPayment);
router.get('/orderSuccess/:paymentType/:id', productcontroller.orderSuccess);
// Cart Checkout
router.get('/user/cartCheckout', productcontroller.cartcheckout);

export default router;