import bcrypt from 'bcrypt';
import adminModel from '../model/admin/adminmodel.js'
import userModel from '../model/usermodel.js'


function countUser(users){
  let count = 0;
  for(let e of users){
    if(count == 0){
      count = 1;
    }else{
      count++
    }
  }
 return count
}

export default {

  // <<< Controller for rendering the admin login page >>> //
  login : (req,res) => {
       res.render('admin/adminlogin.ejs');
  },

  // <<< Controller for handling the post req from the Admin Login page >>> //
  home : async (req,res) => {
       const { username, password } = req.body;
       const admin = await adminModel.findOne({ username : username });
       const check = bcrypt.compareSync(password, admin.password);
       if(check){
        req.session.isAdmin = true;
        res.redirect('/admin/panel');
       }else{
        res.send('try again...');
       }
   },

  dashboard : (req,res)=>{
      res.render('admin/home.ejs');
   },

  users : async (req,res) => {
    const users =  await userModel.find({});
    const userCount = countUser(users);
    res.render('admin/users.ejs',{users,userCount});
  }, 
  
  userdelete : async(req,res) => { 
    try{
      const { id } = req.params;
      const user = await userModel.findByIdAndDelete({ _id : id});
      console.log(user);
      res.redirect('/admin/panel/user_management');
    }catch(e){
      console.log(e.message);
    } 
  },

  useredit : (req,res) => {
    res.render('admin/useredit.ejs');
  }


}