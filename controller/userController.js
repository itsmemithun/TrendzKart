export default  {
   userLogin : (req,res) => {
    res.render('user/login.ejs');
  },

   userValidate : (req,res) => {
     res.send('login post req recived');
   }
}