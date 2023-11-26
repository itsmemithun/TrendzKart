import bcrypt from 'bcrypt';
import adminModel from '../model/admin/adminmodel.js';
import userModel from '../model/usermodel.js';
import productModel from '../model/product/product.js';
import categoryModel from '../model/admin/category.js';


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
    try{
       const { username, password } = req.body;
       console.log(password);
       const admin = await adminModel.findOne({ username : username });
       if(admin){
         const check = bcrypt.compareSync(password, admin.password);
         if(check){
          req.session.isAdmin = true;
          res.redirect('/admin/panel');
         }
       }else{
        console.log('req reached else case');
        res.redirect('/admin');
       }
    }catch(e){
      console.log(e.message);
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
    res.redirect('/admin/panel/products');
  },
  
  editproduct : async(req,res) => {
    try{
      const id = req.params.id;
      const product = await productModel.findById(id);
      res.render('admin/productedit.ejs', { product });
    }
    catch(e){
      console.log(e.message);
    }
  },

  updateproduct : async (req,res) => {
    try{
      const id = req.params.id;
      const productData = req.body;
      const imgData = req.file.path;
      const updateData = {
        $set :{
           ...productData,
          image : imgData
        }
      }
      console.log(updateData);
      const product = await productModel.findByIdAndUpdate(id, updateData, {new : true});
      console.log(product);
      res.redirect('/admin/panel/products');
      }catch(e){
       console.log(e);
    }
  },

  deleteProduct : async (req,res)=>{
    try{
      const productid = req.body.productid;
      console.log(productid);
      const product = await productModel.findByIdAndDelete(productid);
      const usersWithDeletedProductInCart = await userModel.find({ cart : productid });
      // Deleting product from the cartList
      for(let user of usersWithDeletedProductInCart){
        user.cart = user.cart.filter((item) => {
          return item != productid;   
        });
        await user.save();
      }
      // Deleting product from the wishList
      const userWithDeletedProductInWishList = await userModel.find({ wishlist : productid });
      for(let user of userWithDeletedProductInWishList){
        user.wishlist = user.wishlist.filter((item) => {
          return item != productid;
        });  
        await user.save();
      }
      res.json({result : 'Product Deleted Succefully'});
    }catch(e){
      console.log("Error>>>"+e.message);
    }
  },

  category : async (req,res)=>{
    try{
      const categories = await categoryModel.find({});
      res.render('admin/category.ejs', { categories });                                       
    }catch(e){
      console.log(e);
    }
  },

  addCategory : async(req,res)=>{
    try{
      const category =  new categoryModel(req.body);
      category.save();
      res.redirect('/admin/panel/category');
    }catch(e){
       console.log(e.message);
    }
  },

  deleteCategory : async (req,res)=>{
   try{
    const categoryid = req.params.id;
    const category = await categoryModel.findByIdAndDelete(categoryid);
    res.redirect('/admin/panel/category');
   }catch(e){
    console.log(e.message);
   }
  },

  editCategory : async(req,res)=>{
     try{
      const categoryid = req.body.productid;
      const category = await categoryModel.findById(categoryid);
      await res.json({ result : category });
     }catch(e){
      console.log(e.message);
     }
  }

}