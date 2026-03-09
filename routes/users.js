const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// GET  /users/settings
router.get('/settings', requireAuth, userController.getSettings);

// PUT  /users/settings
router.put('/settings', requireAuth, upload.single('avatar'), userController.updateSettings);

// GET  /users/:id  — public profile
router.get('/:id', userController.show);

module.exports = router;
