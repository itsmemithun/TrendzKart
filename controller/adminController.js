import bcrypt from 'bcrypt';
import adminModel from '../model/admin/adminmodel.js';
import userModel from '../model/usermodel.js';
import productModel from '../model/product/product.js';


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
      res.redirect('/admin/panel/user_management');
    }catch(e){
      console.log(e.message);
    } 
  },

  useredit : async(req,res) => {
    const { id } = req.params;
    const user = await userModel.findById({ _id : id });
    res.render('admin/useredit.ejs',{ user });
  },

  usereditpost : async(req,res) => {
    const { id } = req.params;
    const userData = req.body;
    console.log(userData);
    const user = await userModel.findByIdAndUpdate(id, userData);
    res.redirect('/admin/panel/user_management');
  },

  products : async(req,res) => {
    const products = await productModel.find({});
    res.render('admin/products.ejs', { products });
  },

  addproduct : (req,res) => {
    res.render('admin/addproduct.ejs');
  },

  addproductdata : async(req,res) =>{
    const productData = req.body;
    const productImg = req.file.path;
    const product = new productModel(productData);
    await product.image.push(productImg);
    await product.save();
  },
  
  editproduct : async(req,res) => {
    try{
      const id = req.params.id;
      const product = await productModel.findById(id);
      console.log(product);
      res.render('admin/productedit.ejs', { product });
    }
    catch(e){
      console.log(e.message);
    }
  }
}