import productModel from "../model/usermodel.js";


export default {

  view : (req,res)=>{
    const id = req.params;
    res.render('user/productview.ejs');
  } 

}