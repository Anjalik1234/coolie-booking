const express = require('express');
const router = express.Router();
const coolieController = require('../controllers/coolieController');

// @route POST /api/coolies/register
// @desc Register a new coolie awaiting approval
router.post('/register', coolieController.registerCoolie);
router.get('/approved', coolieController.getApprovedCoolies);

module.exports = router;
