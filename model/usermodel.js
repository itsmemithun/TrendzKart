import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
const Schema = mongoose.Schema;
import product from './product/product.js';

const userSchema = new Schema({
     email : {
         type: String,
         required : true,
         unique  : true
     },
     address: [{
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
        pincode : {
         type : String,
         required : true
        },
        phone : {
         type : String,
         required : true
        },
        selected : {
          type : Boolean,
          default : false
        }
     }],
     isBlocked : {
      type : Boolean,
      default : false
     },
     phone : {
       type : Number,
       default : ''
     },
     verified : {
        type  : Boolean,
        default : false
     },
     cart : [{
           type : Schema.Types.ObjectId,
           ref : 'product'
     }],
     wishlist : [{
          type : Schema.Types.ObjectId,
          ref : 'product'
     }]
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema); 

export default User;