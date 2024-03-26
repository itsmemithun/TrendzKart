import productModel from "../model/product/product.js";
import userModel from "../model/usermodel.js";
import axios from "axios";
import uniqid from "uniqid";
import sha256 from "sha256";

export default {

  view : async (req,res)=>{
    try{
      const { id } = req.params;
      const product = await productModel.findById(id);
      res.render("user/productview.ejs", {product});
      
    }catch(e){
      console.log(e);
    }
  },
  
  orderDetails : async (req,res)=>{
    try{
       const {id} = req.params;
       const user = req.session.account;
       const account = await userModel.findById({_id : user});
       const selectedAddress = account.address.map(element => {
           if(element.selected == true){
            return element;
           }
       });
       let address = selectedAddress[0];
       const product = await productModel.findById(id);
       res.render('user/orderdetails.ejs', { product, address });
    }catch(e){
      console.log(e);
    }
  },

  payment : async (req,res) => {
  let returnValue = 'sampleData';
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
        "amount": 30000,
        "redirectUrl": `http://localhost:3000/orderSuccess/${merchantTransactionId}`,
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

    const res2 = axios
     .request(options)
           .then( function(response) { 
           returnValue = response.data.data.instrumentResponse.redirectInfo.url;
           console.log(returnValue);
           res.json({ "result" : returnValue });
        })
     .catch(function (error) {
        console.error(error);
      });

    console.log(res2);
      
  },

  orderSuccess : async(req,res) => {
    res.render('user/orderSuccess.ejs');
  }




}