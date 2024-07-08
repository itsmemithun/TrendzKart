import productModel from "../model/product/product.js";
import userModel from "../model/usermodel.js";
import ordersModel from "../model/orders/ordersModel.js";
import axios from "axios";
import uniqid from "uniqid";
import sha256 from "sha256";



async function cartOrder(paymentMethod,paymentStatus,orderId,userId,productId){
  try{
    for(let data of productId){
      const product = await productModel.findById({_id : data});
      const orderData = {
        userId : userId,
        productId : data,
        orderId : orderId,
        orderAmount : product.price,
        paymentStatus : paymentStatus,
        paymentMethod : paymentMethod
      }
      const user = await userModel.findByIdAndUpdate(userId,{ $push: { orders : orderId }});
      const order = new ordersModel({...orderData});
      await order.save();
     }
  }catch(err){
     throw err;
  }
}

async function singleOrder(paymentMethod,orderId,userId,productId){
  try{
    const orderData = {
      userId : userId,
      productId : productId,
      orderTransactionId : req.params.id,
      orderId : orderId,
      orderAmount : amount,
      paymentMethod : paymentMethod
    }
    const user = await User.findByIdAndUpdate(userId,{ $push: { orders: orderId }});
    const order = new ordersModel({...orderData});
    await order.save();
  }catch(err){
     throw err
  }
}

export default {

  view : async (req,res)=>{
    try{
      const { id } = req.params;
      const product = await productModel.findById(id);
      if(!req.session.account){
        res.locals.userPurpose = "login";
      }else{
        res.locals.userPurpose = undefined;
      }
      res.render("user/productview.ejs", {product});
    }catch(e){
      console.log(e);
    }
  },
  
  orderDetails : async (req,res)=>{
    try{
       const { id } = req.params;
       const user = req.session.account;
       if(user){
         const account = await userModel.findById({_id : user});
         if(account.address.length === 0 ){
          req.flash('error', 'Add address to continue');
          res.redirect(`/user/user_account/address_management/${account._id}?productId=${id}`);
         }
         const selectedAddress = account.address.map(element => {
             if(element.selected == true){
              return element;
             }
         });
         let address = selectedAddress[0];
         const product = await productModel.findById(id);
         res.render('user/orderdetails.ejs', { product, address });
       }else{
        res.redirect('/user_login');
       }
    }catch(e){
      console.log(e);
    }
  },

  payment : async (req,res) => {
  const productId = req.params;
  req.session.productId = productId;
  req.session.price = req.body.amount;
  let returnValue = '###';
  const { amount } = req.body;
  
  const PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
  const MERCHANT_ID = "PGTESTPAYUAT";
  const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
  const SALT_INDEX = 1;
  
      const payEndPoint = "/pg/v1/pay";
      const merchantTransactionId = uniqid();
      const userId = 123;
      const payLoad = {
        "merchantId": MERCHANT_ID,
        "merchantTransactionId": merchantTransactionId,
        "merchantUserId": userId,
        "amount": amount * 100,
        "redirectUrl": `http://localhost:3000/orderSuccess/onlineTransaction`,
        "redirectMode": "REDIRECT",
        "callbackUrl": "https://webhook.site/callback-url",
        "mobileNumber": "9999999999",
        "paymentInstrument": {
            "type": "PAY_PAGE"
          }
      }
  
      const bufferObj = Buffer.from(JSON.stringify(payLoad), "utf8");
      const base64EncodedString = bufferObj.toString('base64');
      const xVerify = sha256(base64EncodedString + payEndPoint + SALT_KEY) + "###" + SALT_INDEX

      const options = {
      method: 'post',
      url: `${PHONE_PE_HOST_URL}${payEndPoint}`,
      headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            "X-VERIFY" : xVerify,
            },
      data: {
          request : base64EncodedString,
          }
      };
      console.log(options.data)

    const res2 = axios
     .request(options)
           .then( function(response) { 
           returnValue = response.data.data.instrumentResponse.redirectInfo.url;
           console.log(returnValue); 
           res.json({ 
            "result" : returnValue,
            "paymentMethod" : "onlineTransaction"
          });

        })
     .catch(function (error) {
        console.log("error");
        console.error(error.message);
      });

  },
  // coupon price should be decreased from the actual price here
  codPayment : async(req,res) => {
    try{
      const {productId} = req.body;
      res.json({
        'result' : productId,
        'paymentMethod' : 'CashOnDelivery'
      });
    }catch(e){
      console.log(e);
    }
  },

  creatingOrder : async(req,res) => {     
    try{
      const paymentMethod = req.params.paymentType;
      const paymentStatus = (paymentMethod == "CashOnDelivery") ? "notPaid" : null ;
      const orderId = uniqid();
      const userId = req.session.account;  
      if(req.body.productId.length > 0){
         await cartOrder(paymentMethod,paymentStatus,orderId,userId,req.body.productId);
      }else{
         await singleOrder(paymentMethod,paymentMethod,orderId,userId,req.body.productId)
      }
      res.json({result : 'success'})
    }catch(err){
      res.json({result : 'error', error : err.message});
    }
  },

  orderSuccess : (req,res)=>{
   try{
     res.render('user/orderSuccess.ejs');
   }catch(e){
    console.log(e.message)
   }
  }

}