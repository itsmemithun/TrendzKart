import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    productId : {
      type : Schema.Types.ObjectId,
   },
    orderAmount : {
       type : Number
    },
    paymentStatus : {
       type : String
    },
    orderId : {
       type : String
    },
    userId : {
      type : Schema.Types.ObjectId,
      required : true
    },
    orderTransactionId :{
      type : String,
    },
    paymentMethod : {
       type : String
    },
    status : {
      type : String,
      default : "Ordered"
    }
})

const Order = mongoose.model('Order', orderSchema);

export default Order;