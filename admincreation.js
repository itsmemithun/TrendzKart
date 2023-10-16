import bcrypt from 'bcrypt';
import adminModel from './model/admin/adminmodel.js'
import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/TrendzzDB')
     .then(async()=>{
       console.log('Database Connected Successfully');
      }) 

const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync(process.env._ADMIN_PASSWORD, salt);

pass(hash);

async function pass(hash){
  try{
    const admin =  new adminModel({ username : process.env._ADMIN_NAME , password : hash });
    await admin.save();
    return console.log('successfully created admin');
  }catch(e){
    console.log(e.message);
    console.log('there is a error');
  }
}

