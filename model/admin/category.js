import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  
        category : {
          type : String,
          required : true
        }
})

const category = mongoose.model('category', categorySchema);

export default category;