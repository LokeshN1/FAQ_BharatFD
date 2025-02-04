import express from 'express';
import { adminLogin, adminLogout, checkAuth } from '../controllers/admin.Controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin login route
router.post('/login', adminLogin);
router.post('/logout', adminLogout);
router.get('/check-auth', verifyAdmin, checkAuth );

export default router;