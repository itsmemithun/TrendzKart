import express from 'express';
const router = express.Router();
import admincontroller from '../controller/adminController.js';
import { isAdmin } from '../middleware/admin_middleware.js';
import { uploadProductimage } from '../middleware/admin_middleware.js';
import nocache from 'nocache';

router.get('/', admincontroller.login);
router.post('/login', admincontroller.home);
router.get('/panel', isAdmin, nocache(), admincontroller.dashboard);
router.get('/panel/user_management', isAdmin, nocache(), admincontroller.users);
router.get('/panel/user_management/delete_user/:id',isAdmin, nocache(), admincontroller.userdelete);
router.get('/panel/user_management/edit_user/:id',isAdmin, nocache(), admincontroller.useredit);
router.post('/panel/user_management/edit_user/:id',isAdmin, admincontroller.usereditpost);
// products render route //
router.get('/panel/products', nocache(), admincontroller.products);
// Add product Route
router.get('/panel/products/add_product', isAdmin, admincontroller.addproduct);
// Add product post req Route
router.post('/panel/products/add_product', uploadProductimage.single("image"), admincontroller.addproductdata);
// edit product route 
router.get('/panel/products/edit_product/:id', admincontroller.editproduct);
// edit product post route 
router.post('/panel/products/edit_product/:id', uploadProductimage.single("image"), admincontroller.updateproduct);
// delete route for deleting products
router.get('/panel/products/delete_product/:id', admincontroller.deleteProduct);
// category management route

export default router;