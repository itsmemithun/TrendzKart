import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const returnOrderSchema = new Schema({
   orderId : {
     type : String,
   },
   userId : {
     type : String
   },
   status : {
     type : String,
     default : 'Pending'
   },
   issue : {
    type : String
   },
   accountHolderName : {
    type : String
   },
   accountNumber : {
    type : String
   },
   bankIFSCCode : {
    type : String
   },
   branchName : {
    type  : String
   }
})

const returnOrder = mongoose.model('returnOrder', returnOrderSchema);

export default returnOrder;
