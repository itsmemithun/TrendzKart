import express from 'express';
const router = express.Router();
import admincontroller from '../controller/adminController.js';
import { isAdmin } from '../middleware/admin_middleware.js';

router.get('/', admincontroller.login);
router.post('/login',isAdmin, admincontroller.home);
router.get('/panel', isAdmin, admincontroller.dashboard);
router.get('/panel/user_management', isAdmin, admincontroller.users);
router.get('/panel/user_management/delete_user/:id',isAdmin, admincontroller.userdelete);
router.get('/panel/user_management/edit_user/:id',isAdmin, admincontroller.useredit);
router.post('/panel/user_management/edit_user/:id',isAdmin, admincontroller.usereditpost);


export default router;