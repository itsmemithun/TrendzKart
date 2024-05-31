import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bannerSchema = new Schema({
  bannerName : {
    type : String,
    required : true
  },
  path : {
      type : String
  },
  bannerId : {
    type : String
  }
});

const banner = mongoose.model('banner', bannerSchema);

export default banner;