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
    image : {
      type : [String],
    },
    category : {
      type : String,
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