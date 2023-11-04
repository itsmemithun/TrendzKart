import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
const Schema = mongoose.Schema;

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
     phone : {
       type : Number,
       default : ''
     },
     verified : {
        type  : Boolean,
        default : false
     },
     wishlist : {
        type  : [{ 
         productid : {type : String} 
      }],
     }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema); 

export default User;