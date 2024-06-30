import bcrypt from 'bcrypt';
import adminModel from '../model/admin/adminmodel.js';
import userModel from '../model/usermodel.js';
import productModel from '../model/product/product.js';
import categoryModel from '../model/admin/category.js';
import bannerModel from '../model/banner/banner.js';
import { unlink } from 'node:fs/promises';
import couponModel from '../model/admin/couponmodel.js'


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
         }else{
           res.redirect('/admin');
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

  addproduct : async (req,res) => {
    const categories = await categoryModel.find({});
    res.render('admin/addproduct.ejs', { categories });
  },

  addproductdata : async(req,res) =>{
    const productData = req.body;
    const productImg = req.files.map((e)=>{
      return e.path;
    })
    const product = new productModel(productData);
    productImg.forEach( async(e)=>{
       await product.image.push(e);
    })
    await product.save();
    res.redirect('/admin/panel/products');
  },
  
  editproduct : async(req,res) => {
    try{
      const id = req.params.id;
      const product = await productModel.findById(id);
      const categories = await categoryModel.find({})
      res.render('admin/productedit.ejs', { product, categories });
    }
    catch(e){
      console.log(e.message);
    }
  },

  updateproduct : async (req,res) => {
    try{
      const id = req.params.id;
      const productData = req.body;
      const existingImages = req.body.existingImage;
      delete req.body.existingImage;
      let newImg = req.files.map(function(e){
           return e.path;
      });
      const imgData = newImg.concat(existingImages);
      const updateData = {
        $set :{
          ...productData,
          image : imgData
        }
      }
      const product = await productModel.findByIdAndUpdate(id, updateData, {new : true});
      res.redirect('/admin/panel/products');
      }catch(e){
       console.log(e);
    }
  },

  deleteImage : async(req,res)=>{
    try{
      const {path} = req.body;
      console.log(path);
      const result = await unlink(path,(err)=>{
        if(err){
          return res.status(500).json({ result : "failed" });       
        }else{
          res.json({ result : "success" });
        }
      });
       console.log(result);
    }catch(e){
      console.log(e);
    }
  },


  getProductFile : async(req,res)=>{
      const data = req.body.value;
      console.log(data);       
  },

  deleteProduct : async (req,res)=>{
    try{
      const productid = req.body.productid;
      const product = await productModel.findByIdAndDelete(productid);
      console.log(product);
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

      // delete product image from the server
      for(let path of product.image){
      const result = await unlink(path,(err)=>{
        if(err){
          return res.status(500).return(err);       
        }
      });
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
  },

  updateCategory : async (req,res)=>{
    try{
      const id = req.params.id;
      const data = req.body;
      console.log(id);
      console.log(data);
      const category = await categoryModel.findByIdAndUpdate(id, data, {new : true});
      console.log(category);
      res.redirect('/admin/panel/category');
    }catch(e){
      console.log(e);
    }
  },

  userSearch : async (req,res)=>{
    try{
      const searchTerm = req.body.searchValue;
      const matchedData = await userModel.find({username : { $regex : `^${searchTerm}`, $options : 'i' }});
      res.json({ result : matchedData });
    }catch(e){
      console.log(e);
    }
  },

  // Get all Banners
  banner : async (req,res)=>{
    try{
      let banners = await bannerModel.find({});
      if(banners.length === 0){
        banners = '';
        console.log('no banners uploaded');
      }
      res.render('admin/bannerManagement.ejs',{ banners });
    }catch(e){
      console.log('error');
      console.log(e);
    }
  },

  // Uploads banners
  bannerUpload : async(req,res) => {
    try{
      console.log('!Banner Upload')
      const dataToDltBnr = req.body.current_banner_id;
      const newBannerId = req.body.banner_id;
      console.log(newBannerId);
      if(dataToDltBnr){
        const deletedBanner = await bannerModel.deleteOne({ bannerId : dataToDltBnr });
      }
      const banner = new bannerModel({
        bannerName : req.file.originalname,
        path : req.file.path,
        bannerId : newBannerId
      })
      banner.save();
      res.redirect('/admin/panel/banner_management');
    }catch(e){
     console.log(e);
    }
  },

  bannerDelete : async (req,res)=>{
    try{
      const bannerId = req.params;
      const bannerData = await bannerModel.findOne({bannerId : bannerId.id});
      await unlink(bannerData.path)
      const bannerDlt = await bannerModel.findOneAndDelete({bannerId : bannerId.id});
     res.redirect('/admin/panel/banner_management');
    }catch(e){
      console.log(e.message);
    }
  },

  coupon : async (req,res)=>{
    try{
      const coupons = await couponModel.find({});
      console.log(coupons);
      res.render('admin/coupon.ejs',{coupons});
    }catch(e){
       console.log(e.message);
    }
  },

  addCoupon : async (req,res)=>{
    try{    
      const couponData = req.body;
      console.log(couponData);
      const data = new couponModel(couponData);
      console.log(data);
      data.save();
      res.redirect('/admin/panel/coupon_management');
    }catch(e){
      console.log(e.message);
    }
  },

  deleteCoupon : async (req,res)=>{
    try{
      const id = req.params.id;
      const coupon = await couponModel.findByIdAndDelete({_id : id})
      res.redirect('/admin/panel/coupon_management');
    }catch(e){
      console.log(e);
    }
  }
}