import User from '../model/usermodel.js';
import passport from 'passport';

export default  {

   home : (req,res) => {
      if(!req.isAuthenticated()){
         console.log('you are not authenticated');
         return res.send('try again..');
      }
      res.render('user/home.ejs');
   },

   userLogin : (req,res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.render('user/login.ejs');
  },

   userValidate : (req,res) => { 
     res.redirect('/');
  },

   userSignup : (req,res) => {
     res.render('user/signup.ejs');
  },

   userRegister : async(req,res) => {
      const { username,emailaddress,password,confirmPassword } = req.body;
      if(password != confirmPassword){
        console.log('password is not matching');
        return res.redirect('/user_signup');
      }
      else{
         const user = new User({ username : username, email : emailaddress });
         const registeredUser = await User.register(user, password);
         console.log(registeredUser);
         res.redirect('/');
      }
   }
}