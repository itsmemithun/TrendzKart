import express from 'express';
const router = express.Router();
import admincontroller from '../controller/adminController.js';

router.get('/', admincontroller.home);

export default router;