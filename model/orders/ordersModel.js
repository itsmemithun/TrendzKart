import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    productId : {
      type : Schema.Types.ObjectId,
      ref : 'product'
   },
    orderAmount : {
       type : Number
    },
    dateOfOrderPlaced : {
        type : String
    },
    paymentStatus : {
       type : String
    },
    orderId : {
       type : String
    },
    userId : {
      type : Schema.Types.ObjectId,
      required : true,
      ref : 'User'
    },
    orderTransactionId :{
      type : String,
    },
    paymentMethod : {
       type : String
    },
    returnReqId : {
       type : Schema.Types.ObjectId,
       ref : 'returnOrder'
    },
    returnRequested : {
       type : Boolean,
       default : false
    },
    cancelRequested : {
       type : Boolean,
       default : false
    },
    cancelledStatus : {
      type : String,
      default : ""
    },
    returnStatus : {
       type : String,
       default : ''
    },
    shippingAddress : {
       personName : {
       type : String,
       required : true
       },
       address : {
       type : String,
       required : true
       },
       district : {
       type : String,
       required : true
       },
       state : {
       type : String,
       required : true
       },
       pincode : {
       type : String,
       required : true
       },
       phone : {
       type : String,
       required : true
       },
       
    },
    status : {
      type : String,
      default : "Ordered"
    }
})

const Order = mongoose.model('Order', orderSchema);

export default Order;