import User from '../model/usermodel.js';
import userRegistration from '../model/userRegistrationModel.js';
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator';
import dotenv from 'dotenv';

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
      if(!req.user){
         res.locals.userPurpose = "login"
         return res.render('user/home.ejs');
      }else{
         res.render('user/home.ejs'); 
      }    
   },
 
// <<< Login Page Render Route >>> //
   userLogin : (req,res) => {
    const result = loginCheck(req);
    console.log(result);
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
      transporter.sendMail({                                
         from : process.env._EMAIL,
         to   : emailaddress,
         subject : 'OTP Verification',
         text   : 'Verify Your Email Using the OTP',
         html   : `<h3>Verify Your Email Using this OTP:${otp}</h3>`
      },(err,info)=>{
         if(err){
            console.log('we got an error'+err);
         }else{
            console.log(info.messageId);
         }
      });   
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
         req.session.isLoggedIn = true;
         req.flash('success', 'Successfully Created a Account!');
         res.redirect('/');
      }else{
         res.send('somethings wrong try again');
      }
   },
 
   userdashboard : async(req,res) => {
         const id = req.session.account;
         const user = await User.findById(id);
         console.log(user.address);
         res.render('user/userdashboard.ejs', {user});
   }, 

   userdashboardedit : async(req,res) => {
      const id = req.session.account;
      const data = req.body;
      const user = await User.findByIdAndUpdate(id,data,{ new : true });
      req.flash('success','Profile Edited Succefully');
      res.redirect('/user/user_account');
   },

   userLogout : (req,res) => {
      req.session.destroy();
      res.redirect('/user_login');
   }
}