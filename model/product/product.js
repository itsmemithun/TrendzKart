import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName : {
        type : String,
        required : true
    },
    price : {
      type : Number,
      required : true
    },
    rating : {
      type : Number,
      default : 0
    },
    image : {
      type : [String],
    },
    category : {
      type : Schema.Types.ObjectId,
    },
    description : {
      type : String
    },
    stock : {
      type : String
    }

});

const product = mongoose.model('product', productSchema);

export default product;