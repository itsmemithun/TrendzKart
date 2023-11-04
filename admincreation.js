// import bcrypt from 'bcrypt';
// import adminModel from './model/admin/adminmodel.js'
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// const password = process.env._ADMIN_PASSWORD;
// const name = process.env._ADMIN_NAME;

// mongoose.connect('mongodb://127.0.0.1:27017/TrendzzDB')
//      .then(async()=>{
//        console.log('Database Connected Successfully');
//       }) 

// const salt = bcrypt.genSaltSync(12);
// const hash = bcrypt.hashSync(password, salt);

// pass(hash);

// async function pass(hash){
//   try{
//     const admin =  new adminModel({ username : name , password : hash });
//     await admin.save();
//     return console.log('successfully created admin');
//   }catch(e){
//     console.log(e.message);
//     console.log('there is a error');
//   }
// }


