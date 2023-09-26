import express from 'express';
const router = express.Router();
import usercontroller from '../controller/userController.js';

router.get('/', (req,res)=>{
  res.send('home page');
})

router.get('/user_login', usercontroller.userLogin);

router.post('/user_login', usercontroller.userValidate);

export default router;