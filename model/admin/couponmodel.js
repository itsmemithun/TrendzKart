import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const couponSchema = new Schema({
    couponCode : {
      type : String,
      unique : true,
      required : true,
    },
    value : {
      type : Number,
      required : true
    },
    used : {
      type : Boolean,
      default : false
    }
})

const coupon = mongoose.model('coupon', couponSchema);

export default coupon;