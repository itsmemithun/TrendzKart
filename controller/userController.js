import User from '../model/usermodel.js';
import userRegistration from '../model/userRegistrationModel.js';
import productModel from '../model/product/product.js';
import categoryModel from '../model/admin/category.js';
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator';
import dotenv from 'dotenv';
import couponModel from '../model/admin/couponmodel.js'

dotenv.config();

const emailPattern = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/

const OTP = function(){
   const otp = otpGenerator.generate(6, { lowerCaseAlphabets : false, upperCaseAlphabets: false, specialChars: false });
   return otp;
}

function loginCheck(req){
   if(req.session.isLoggedIn == true){
      return true;
    }else{
      return false;
    }
}

const transporter = nodemailer.createTransport({
   service : 'Gmail',
   auth: {
       user : process.env._EMAIL, 
       pass : process.env._PASSWORD   
   },
});

export default  {

//  <<< Home Route >>> //
   home : async(req,res) => {
      const products = await productModel.find({});
      const categories = await categoryModel.find({});
      if(!req.user){
         res.locals.userPurpose = "login"
         return res.render('user/home.ejs',{ products,categories });
      }else{
         res.render('user/home.ejs', { products,categories }); 
      }    
   },
   
   policy : (req,res)=>{
     res.render('user/policy.ejs');
   },

   termsandconditions : (req,res)=>{
      res.render('user/termsAndConditions.ejs');
   },

   aboutUs : (req,res)=>{
      res.render('user/aboutus.ejs');
   },

   returnAndRefund : (req,res)=>{
      res.render('user/returnAndRefund.ejs');
   },

   contactUs : (req,res)=>{
      res.render('user/contactus.ejs');
   },
 
// <<< Login Page Render Route >>> //
   userLogin : (req,res) => {
    const result = loginCheck(req);
    if(result == true){
      return res.redirect('/');
    }
    res.locals.userPurpose = "login";
    res.render('user/login.ejs',);
  },

//  <<< Login Page Form Data Validation Route, The Validation Has Been Done By Passport's Inbuilt Methods So This Route Doesn't 
//  Need to do Anything >>> //  
   userValidate : (req,res) => { 
     req.session.isLoggedIn = true;
     req.session.account = req.user._id;
     req.flash('success','You are Logged in successfully');
     res.redirect('/');
  },

// <<< SignUp page render Route >>> //  
   userSignup : (req,res) => {
     const navDataLog = loginCheck(req);
     res.locals.userPurpose = "signup";
     res.render('user/signup.ejs',);
  },

// Temp User Creation,Otp generation,Email sending and OTP verification page rendering is done through this route
   userRegister : async(req,res,next) => {
      const { username,emailaddress,password,confirmPassword } = req.body;
      if(password != confirmPassword){
        console.log('password is not matching');
        req.flash('error','Check Your Username/Password?');
        return res.redirect('/user_signup');
      }
      else{
       if(emailPattern.test(emailaddress)){
      // <<< Creating a Temp user and Saving it to the DB so that we can Access it in the next route >>> //  
      const tempUser = new userRegistration({ username : username, email : emailaddress, password : password, verified : false, expireAt : new Date() });
      await tempUser.save();
      const otp = OTP();
      console.log(otp);
      req.session.Otp = otp; 
      req.session._userid = tempUser._id;
      / <<< Sending The Email >>> ///
      // transporter.sendMail({                                
      //    from : process.env._EMAIL,
      //    to   : emailaddress,
      //    subject : 'OTP Verification',
      //    text   : 'Verify Your Email Using the OTP',
      //    html   : `<h3>Verify Your Email Using this OTP:${otp}</h3>`
      // },(err,info)=>{
      //    if(err){
      //       console.log('we got an error'+err);
      //    }else{
      //       console.log(info.messageId);
      //    }
      // });   
      res.render('user/otp.ejs');
      }else{
         req.flash('error','Invalid Email Address!');
         res.redirect('/user_signup');
      }
      }
     },

   emailVerificationRegister : async(req,res) => {
      const { otp } = req.body;
      if(req.session.Otp === otp){
         const tempuser = await userRegistration.findById(req.session._userid);
         const {username , email , password} = tempuser;
         const user = new User({ username : username, email : email, verified : true });
         const registeredUser = await User.register(user, password);
         console.log("djfndsfnas"+registeredUser);
         req.session.account = registeredUser._id;
         req.session.isLoggedIn = true;
         req.flash('success', 'Successfully Created a Account!');
         res.locals.userPurpose = undefined;
         const products = await productModel.find({});
         const categories = await categoryModel.find({});
         res.render('user/home.ejs',{products,categories});
      }else{
         res.send('somethings wrong try again');
      }
   },

   passwordRecovery : (req,res)=> {
    res.render('user/passwordRecovery.ejs');
   },

   passwordRecoveryAcquiringUserInfo: async (req,res)=>{
     const {email} = req.body;
     const otp = OTP();                                       console.log(otp);
     const user = await User.findOne({email : email});
     console.log(otp);
     if(user){
      req.session.userId = user._id;
      //  transporter.sendMail({                                
      //    from : process.env._EMAIL,
      //    to   : user.email,
      //    subject : 'Password Recovery',
      //    text   : 'Verify Your Email Using the OTP',
      //    html   : `<h3>Verify Your Email Using this OTP:${otp}</h3>`
      // },(err,info)=>{
      //    if(err){
      //       console.log('we got an error'+err);
      //    }else{
      //       console.log(info.messageId);
      //    }
      // }); 
      req.session.credentialsRecoveryOtp = otp;
      res.render('user/passwordRecoveryOtpPage.ejs');
     }else{
      res.send('user not found');
     }
   },
   
   passwordRecoveryVerifyOtp : (req,res)=>{
    const {otp} = req.body;
    if(otp === req.session.credentialsRecoveryOtp){
       console.log('otp matching');
       res.render('user/changePassword.ejs');
    }
   },

   changeUserCredentials : async(req,res)=>{
      try{
         const password = req.body.newPassword;
         const user = await User.findById({_id : req.session.userId});
         await user.setPassword(password,)   
         user.save();
         res.redirect('/user_login');
      }catch(e){
         console.log(e);
      }
   },
 
   userdashboard : async(req,res) => {
         const id = req.session.account;
         const user = await User.findById(id);
         res.render('user/userdashboard.ejs', {user});
   }, 

   useredit : async(req,res) => {
      const id = req.session.account;
      let user = await User.findById(id);
      res.render('user/useredit.ejs', { user });
   },

   updateAddress : async(req,res)=>{
      try{
         let useraddress = {};
         const id = req.session.account;
         const { username,accountPhone,email,addressname,addressPhone,addressData,district,pincode } = req.body;
         useraddress = {
            personName : addressname,
            address    : addressData,
            district   : district,
            pincode    : pincode,
            phone      : addressPhone
         }
         let data = {
            username : username,
            email    : email,
            phone    : accountPhone,
            address  : useraddress
         }
         const user = await User.findByIdAndUpdate(id,data,{new : true});
         res.redirect(`/user/user_account/address_management/${id}`);
      }catch(e){
        console.log(e);
      }
   },

   selectAddress : async(req,res)=>{
      try{
         let { initialSelectedData,currentData } =  req.body;
         const id = req.session.account;
         const user = await User.findById(id);
         if(currentData){
           for(let e of user.address){
            console.log(typeof e._id,currentData);
              if(e._id == currentData){
                 e.selected = true;
              }  
           }
           for(let e of user.address){
            console.log(typeof e._id,initialSelectedData);
              if(e._id == initialSelectedData){
                  e.selected = false;
              }
           }
        }
        user.save();
        res.json({result : user});
      }catch(e){
         console.log(e);
         console.log(e.message);
      }
   },

   deleteAddress : async(req,res)=>{
      try{
       const { addressId } = req.body;
       const userId = req.session.account;
       const data =  await User.updateOne({_id : userId},{ $pull : { address : { _id : addressId } } })
       res.json({ result : data })
     }catch(e){
      console.log(e.message);
     }
   },

   userLogout : (req,res) => {
      req.session.destroy();
      res.redirect('/user_login');
   },
   // Adding product to Wishlist
   addtowishlist : async (req,res) => {
      try{
         const productid = req.body.productid;
         let wishlistcheck = req.body.productid;
         const id = req.session.account;
         const user = await User.findByIdAndUpdate(id, { $push : { wishlist : productid } });
         const product = await User.findOne({ _id : id, wishlist : { $elemMatch : { productid : wishlistcheck }}}); 
         res.json({result: 'Added'});
      }catch(e){
         console.log(e);
         console.log(e.message);
      }
   },
   // Removing product from wishlist
   removefromwishlist : async (req,res) => {
      try{
         console.log('wishlist remove');
         const productid = req.body;
         let wishlistcheck = req.body.productid;
         const id = req.session.account;
         const user = await User.findByIdAndUpdate(id, {$pull : { wishlist : productid }});
         res.json({ result : 'Removed'});
      }
      catch(e){
         console.log(e);
      }
   },
   
   showwishlist : async (req,res)=>{
      try{
      let products = [];
      const userid = req.session.account;
      const userdata = await User.findById({ _id : userid });
      const wishlist = userdata.wishlist;
      for(let data of wishlist){
      const result = await productModel.findById({ _id:data });
      products.push(result);
      } 
      res.render('user/wishlist.ejs', { products });
      }catch(e){
       console.log(e);
      }
   },

   showcart : async (req,res) => {
      try{
         let cart_products = [];
         const product_total = [];
         const userid = req.session.account;
         const userdata = await User.findById({ _id : userid });
         const cartlist = userdata.cart;
         for(let data of cartlist){
            const result = await productModel.findById({ _id : data })
            cart_products.push(result);
         }
         const productpriceData = cart_products.map(function(product){ 
            return product.price;
         });
         let productSum = 0;
         for(let i=0; i<productpriceData.length; i++){
            productSum += productpriceData[i];
         }        
         res.render('user/cart.ejs', {cart_products,productSum});
      }catch(e){
         console.log(e);
      }
   },

   addtocart : async(req,res) => {
    try{
      const id = req.session.account;
      const productid = req.body.productid;     
      const userdata = await User.findByIdAndUpdate(id, { $push : { cart : productid } });
      res.json({ result : 'Added'});
   }catch(e){
      console.log(e)
   }
   },

   getPriceofProduct : async(req,res)=>{
      try{
         const id = req.body.productid;
         const product = await productModel.findById(id);
         res.json({ result : product.price });
      }catch(e){
         console.log(e.message);
      }
   },

   deleteFromCart : async(req,res)=>{
      console.log('req reached here');
         try{
         const userid = req.session.account;  
         const productid = req.params.id;
         const product = await User.findOneAndUpdate( { _id : userid},{ $pull : { cart : productid }} );
         res.redirect('/user/cart'); 
      }catch(e){
         console.log(e);
      }
   },

   deleteFromWishList : async(req,res)=>{
    try{
      const userid = req.session.account;
      const productid = req.params.id;
      const product = await User.findOneAndUpdate({ _id : userid }, { $pull : { wishlist : productid }});
      res.redirect('/user/wishlist');
    }catch(e){
      console.log(e.message);
    }
   },

   category : async(req,res)=>{
      try{
       const products = await productModel.find({});
       const categories = await categoryModel.find({});
       res.render('user/category.ejs', { categories, products});
      }catch(e){
         console.log(e);
      }
   },

   categoryFilter : async (req,res)=>{
      try{
        const data = req.body;
        if(!data.price){
         res.redirect("/user/category");
        }
        const priceLimits = data.price.split("-");
        const limit = priceLimits.map((e)=>{
          return parseInt(e);
        }) 
        const filteredResult = await productModel.aggregate(
         [
            {
               $match: { category : data.category},
            },
            {
               $match: { price : { $gt : limit[0], $lt : limit[1] } }
            }
         ]
         )
        const categories = await categoryModel.find({});
        res.render('user/category.ejs', {filteredResult,categories});
      }catch(e){
         console.log(e);
      }
   },

   addAddress : async(req,res)=>{
      try{
      const id = req.session.account;
      const data = req.body;
      const productId = req.session.tempProductId;
      req.session.temProductId = undefined;
      const user = await User.findById(id);
      console.log(user.address.length);
      if(user.address.length == 0){
         user.address.push(data);
         console.log(user.address[0].selected);
         user.address[0].selected  = true;
      }else{
         user.address.push(data);
      }
      user.save();
      res.redirect(`/user/user_account/address_management/${id}?productIdRedirect=${productId}`);
      }catch(e){
         console.log(e);
      }
   },

   manageAddress : async(req,res)=>{
     let redirectProductId;
     const { id } = req.params;
     const productId  = req.query.productId;
     if(req.query.productIdRedirect){
        redirectProductId = req.query.productIdRedirect;
     }
     req.session.tempProductId = productId;
     const user = await User.findById(id);
     const addresses = user.address;
     res.render('user/address.ejs', {addresses,redirectProductId});
   },

   myorders : async(req,res) => {
      const id = req.session.account;
      const user = await User.findById(id);
      console.log(user);
      res.render('user/myorders.ejs',{user});
   },

   validateCoupon : async (req,res)=>{
      const coupon = req.body.data;
      let data;
      const result = await couponModel.findOne({couponCode : coupon});
      if(result){
          data = {
            data : result.couponCode,
            used : result.used,
            validateStatus : true,
            couponId : result._id,
            value : result.value,
         }
      }else{
         data = {
            data : coupon,
            validateStatus : false
         }
      }
      res.json({result : data});
   },
   
}