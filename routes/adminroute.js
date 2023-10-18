import express from 'express';
const router = express.Router();
import admincontroller from '../controller/adminController.js';
import { isAdmin } from '../middleware/admin_middleware.js';
import nocache from 'nocache';

router.get('/', admincontroller.login);
router.post('/login', admincontroller.home);
router.get('/panel', isAdmin, nocache(), admincontroller.dashboard);
router.get('/panel/user_management', isAdmin, nocache(), admincontroller.users);
router.get('/panel/user_management/delete_user/:id',isAdmin, nocache(), admincontroller.userdelete);
router.get('/panel/user_management/edit_user/:id',isAdmin, nocache(), admincontroller.useredit);
router.post('/panel/user_management/edit_user/:id',isAdmin, admincontroller.usereditpost);
// products render route //
router.get('/panel/products', isAdmin, nocache(), admincontroller.products);
// Add product Route
router.get('/panel/products/add_product', isAdmin, admincontroller.addproduct);
// Add product post req Route
router.post('/panel/products/add_product', isAdmin, admincontroller.addproductdata);

export default router;