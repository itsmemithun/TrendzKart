import express from 'express';
import ejsmate from 'ejs-mate';
import userRoute from './routes/userroute.js';
import adminRoute from './routes/adminroute.js';
import { fileURLToPath } from 'url';
import { dirname,join } from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './model/usermodel.js';
import morgan from 'morgan';

// connection to DB 
mongoose.connect('mongodb://127.0.0.1:27017/TrendzzDB')
     .then(async()=>{
       console.log('Database Connected Successfully');
      }) 

dotenv.config();
const port = process.env._PORT

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const sessionConfig = {
   secret: process.env._SECRET_KEY_WORD,
   resave : false,
   saveUninitialized : true
}

// app.use(test);
app.use(morgan('tiny'));
app.use(session(sessionConfig));
app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('view engine', 'ejs');
app.engine('ejs', ejsmate);
app.set('views',join(__dirname,'views'));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', userRoute);
app.use('/admin', adminRoute);

app.listen(port,(req,res) => {
  console.log(`server started on port ${port}`);
})