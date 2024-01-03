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
     address: {
        type : String,
        default : ''
     },
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