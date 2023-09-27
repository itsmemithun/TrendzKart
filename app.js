import express from 'express';
import ejsmate from 'ejs-mate';
import userRoute from './routes/userroute.js';
import test from './test.js';
import { fileURLToPath } from 'url';
import { dirname,join } from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nocache from 'nocache';

// connection to DB 

mongoose.connect('mongodb://127.0.0.1:27017/TrendzzDB')
     .then(()=>{
      console.log('Database Connected Succefully');
     })

dotenv.config();
const port = process.env._PORT

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));
app.set('view engine', 'ejs');
app.engine('ejs', ejsmate);
app.set('views',join(__dirname,'views'));

app.use('/', userRoute);

app.listen(port,(req,res) => {
  console.log(`server started on port ${port}`);
})