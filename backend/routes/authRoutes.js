const express = require('express');
const { register, login, getMe, logout, refresh, updateBudget } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/refresh', protect, refresh);
router.put('/budget', protect, updateBudget);

module.exports = router;
