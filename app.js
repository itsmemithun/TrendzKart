import express from 'express';
import ejsmate from 'ejs-mate';
import userRoute from './routes/userroute.js';
import test from './test.js';
import { fileURLToPath } from 'url';
import { dirname,join } from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.engine('ejs', ejsmate);
app.set('views',join(__dirname,'views'));

app.use('/', userRoute);

const port = 3000
app.listen(port,(req,res) => {
  console.log(`server started on port ${port}`);
})