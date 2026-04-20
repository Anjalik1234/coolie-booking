const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminAuth');

// Public Admin Routes
router.post('/login', adminController.loginAdmin);

// Protected Admin Routes
router.get('/profile', adminController.getAdminProfile);
router.post('/logout', adminController.logoutAdmin);

// Coolie Management
router.get('/coolie-requests', adminController.getPendingCoolieRequests);
router.patch('/coolie-requests/:id', adminController.updateCoolieStatus);
router.get('/coolies', adminController.getAllCoolies);

// Settings
router.patch('/profile', adminController.updateAdminProfile);
router.patch('/password', adminController.updateAdminPassword);
router.get('/stats', adminController.getAdminDashboardStats);

module.exports = router;
