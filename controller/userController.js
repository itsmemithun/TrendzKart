


export default  {
   userLogin : (req,res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.render('user/login.ejs');
  },

   userValidate : (req,res) => {
     res.send('login post req recived');
  },

   userSignup : (req,res) => {
     res.render('user/signup.ejs');
  },

   userRegister : (req,res) => {
      const { username,emailaddress,password,confirmPassword } = req.body;
      if(password != confirmPassword){
        console.log('password is not matching');
        return res.redirect('/user_signup');
      }
      else{

      }
      
  }

}