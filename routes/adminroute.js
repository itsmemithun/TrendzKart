import express from 'express';
const router = express.Router();
import admincontroller from '../controller/adminController.js';
import { isAdmin } from '../middleware/admin_middleware.js';
import { uploadProductimage } from '../middleware/admin_middleware.js';
import { uploadBannerImage } from '../middleware/admin_middleware.js';
import nocache from 'nocache';

router.use(nocache());
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
router.get('/panel/products/add_product', admincontroller.addproduct);
// Add Product Post Request Route
router.post('/panel/products/add_product', uploadProductimage.array("images", 6), admincontroller.addproductdata);
// edit product route 
router.get('/panel/products/edit_product/:id', admincontroller.editproduct);
// edit product post route 
router.post('/panel/products/edit_product/:id', uploadProductimage.array("images"), admincontroller.updateproduct);
// delete route for deleting products
router.delete('/panel/products/delete_product/:id',isAdmin, admincontroller.deleteProduct);
// category management route
router.get('/panel/category',isAdmin, admincontroller.category);
// Add category route
router.post('/panel/category/add',isAdmin, admincontroller.addCategory);
// Category Delete route 
router.get('/panel/category/delete/:id',isAdmin, admincontroller.deleteCategory);
// Category Edit route
router.post('/panel/category/edit/:id',isAdmin, admincontroller.editCategory);
// Category Update route 
router.post('/panel/category/update/:id',isAdmin, admincontroller.updateCategory);
// Route for user Search 
router.post('/panel/user_search',isAdmin, admincontroller.userSearch);
// Route for fetching image files
router.post('/panel/getFile', admincontroller.getProductFile);
// Route for user management
router.get('/panel/banner_management', admincontroller.banner);
// Route for Banner Image Upload
router.post('/panel/banner_upload', uploadBannerImage.single('banner'), admincontroller.bannerUpload);
// Route for banner Deletion 
router.get('/panel/banner_delete/:id', admincontroller.bannerDelete);

export default router;