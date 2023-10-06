import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userRegistrationSchema = new Schema({
  username : {
    type : String,
    required : true,
  },
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  verified : {
    type : Boolean,
    required : true
  }, 
  expireAt : {
    type : Date,
    expires: 120
  }
})

// userRegistrationSchema.index({ expiredAt : 1 });

const userRegistration = mongoose.model('userRegistrations', userRegistrationSchema);

export default userRegistration;