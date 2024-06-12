import productModel from "../model/product/product.js";
import userModel from "../model/usermodel.js";
import ordersModel from "../model/orders/ordersModel.js";
import axios from "axios";
import uniqid from "uniqid";
import sha256 from "sha256";
import User from "../model/usermodel.js"


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
        "redirectUrl": `http://localhost:3000/orderSuccess/onlineTransaction/${merchantTransactionId}`,
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

  codPayment : async(req,res) => {
    try{
      const {price}  = req.body;
      const {productId} = req.body;
      req.session.productId = productId;
      req.session.amount = price;
      res.json({
        'result' : productId,
        'paymentMethod' : 'CashOnDelivery'
      });
    }catch(e){
      console.log(e);
    }
  },

  cartcheckout : (req,res)=>{
    
  },

  orderSuccess : async(req,res) => {
    let productIds = [];
    if(typeof req.session.productId == Array){
       for(let data of req.session.productId){
        productIds.push(data);
       }
    }else{
      console.log(req.session);
      productIds = req.session.productId;
    }
    const paymentMethod = req.params.paymentType;
    const amount = req.session.amount;
    const orderId = uniqid();
    const userId = req.session.account;
    const orderData = {
      userId : userId,
      productId : productIds,
      orderTransactionId : req.params.id,
      orderId : orderId,
      orderAmount : amount,
      paymentMethod : paymentMethod
    }
    const user = await User.findByIdAndUpdate(userId,{ $push: { orders: orderId }});
    const order = new ordersModel({...orderData});
    order.save();
    req.session.productId = undefined;
    req.session.amount = undefined;
    res.render('user/orderSuccess.ejs');
  }
}